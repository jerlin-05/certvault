import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import User from "@/models/User";
import { sendExpiryAlertEmail } from "@/lib/email";

function daysBetween(from, to) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / MS_PER_DAY);
}

async function runCheck() {
  await connectDB();

  const certificates = await Certificate.find({}).populate(
    "owner",
    "name email"
  );

  const today = new Date();
  let checked = 0;
  let emailsSent = 0;
  const errors = [];

  for (const cert of certificates) {
    checked += 1;
    if (!cert.owner?.email) continue;

    const daysRemaining = daysBetween(today, cert.expiryDate);

    // Exactly on the chosen alert day (e.g. alertDaysBefore = 3 -> only when
    // there are precisely 3 days left, not every day inside the window).
    const shouldAlertOnAlertDay =
      daysRemaining === cert.alertDaysBefore &&
      !cert.alertsSent.includes(cert.alertDaysBefore);

    // On the expiry date itself. Uses the same marker as the alert-day check
    // above so if alertDaysBefore is 0 they collapse into a single email
    // instead of sending twice.
    const shouldAlertOnExpiryDay =
      daysRemaining === 0 && !cert.alertsSent.includes(0);

    // Once, after the certificate has actually lapsed.
    const shouldAlertAfterExpiry =
      daysRemaining < 0 && !cert.alertsSent.includes(-1);

    if (
      !shouldAlertOnAlertDay &&
      !shouldAlertOnExpiryDay &&
      !shouldAlertAfterExpiry
    )
      continue;

    try {
      await sendExpiryAlertEmail({
        to: cert.owner.email,
        recipientName: cert.owner.name,
        certificateName: cert.name,
        issuer: cert.issuer,
        expiryDate: cert.expiryDate,
        daysRemaining,
      });

      if (shouldAlertOnAlertDay) cert.alertsSent.push(cert.alertDaysBefore);
      if (shouldAlertOnExpiryDay) cert.alertsSent.push(0);
      if (shouldAlertAfterExpiry) cert.alertsSent.push(-1);
      await cert.save();
      emailsSent += 1;
    } catch (err) {
      console.error(`Failed to email for certificate ${cert._id}:`, err);
      errors.push(cert._id.toString());
    }
  }

  return { checked, emailsSent, errors };
}

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  const headerSecret = request.headers.get("x-cron-secret");
  const authHeader = request.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (
    process.env.CRON_SECRET &&
    secret !== process.env.CRON_SECRET &&
    headerSecret !== process.env.CRON_SECRET &&
    bearerSecret !== process.env.CRON_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await runCheck();
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(request) {
  return GET(request);
}
