import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function sendPasswordResetEmail({ to, recipientName, resetUrl }) {
  const subject = "Reset your CertVault password";

  const html = `
  <div style="background:#F2EFE8;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#FAF9F6;border:1px solid #E7E2D6;">
      <div style="background:#0E1526;padding:24px 32px;">
        <span style="color:#D2A55E;font-size:12px;letter-spacing:0.08em;font-family:Arial,sans-serif;">CERTVAULT</span>
        <h1 style="color:#FAF9F6;font-size:20px;margin:8px 0 0;font-weight:normal;">Reset your password</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#0E1526;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">
          Hello ${recipientName || "there"},
        </p>
        <p style="color:#0E1526;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">
          We received a request to reset your CertVault password. Click the button
          below to choose a new one. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#0E1526;color:#FAF9F6;text-decoration:none;padding:12px 24px;font-size:14px;font-family:Arial,sans-serif;margin-top:12px;">Reset password</a>
        <p style="color:#8A93A0;font-size:12px;margin-top:28px;font-family:Arial,sans-serif;">
          If you didn't request this, you can safely ignore this email — your
          password won't change.
        </p>
      </div>
    </div>
  </div>`;

  const text = `Hello ${recipientName || "there"},

We received a request to reset your CertVault password. Open this link within
1 hour to choose a new one:

${resetUrl}

If you didn't request this, you can ignore this email.`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

export async function sendExpiryAlertEmail({
  to,
  recipientName,
  certificateName,
  issuer,
  expiryDate,
  daysRemaining,
}) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const urgent = daysRemaining <= 7;

  const subject =
    daysRemaining < 0
      ? `Still expired: ${certificateName} (${Math.abs(daysRemaining)} day${
          Math.abs(daysRemaining) === 1 ? "" : "s"
        } ago)`
      : daysRemaining === 0
        ? `Expires today: ${certificateName}`
        : `${certificateName} expires in ${daysRemaining} day${
            daysRemaining === 1 ? "" : "s"
          }`;

  const html = `
  <div style="background:#F2EFE8;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#FAF9F6;border:1px solid #E7E2D6;">
      <div style="background:#0E1526;padding:24px 32px;">
        <span style="color:#D2A55E;font-size:12px;letter-spacing:0.08em;font-family:Arial,sans-serif;">CERTVAULT</span>
        <h1 style="color:#FAF9F6;font-size:20px;margin:8px 0 0;font-weight:normal;">Certificate expiry notice</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#0E1526;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">
          Hello ${recipientName || "there"},
        </p>
        <p style="color:#0E1526;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">
          ${
            daysRemaining < 0
              ? `Your certificate <strong>${certificateName}</strong> expired
          <strong style="color:#E74444;">${Math.abs(daysRemaining)} day${
            Math.abs(daysRemaining) === 1 ? "" : "s"
          } ago</strong> and still needs renewing.`
              : daysRemaining === 0
                ? `Your certificate <strong>${certificateName}</strong> expires <strong style="color:#E74444;">today</strong>.`
                : `Your certificate <strong>${certificateName}</strong> is set to expire in
          <strong style="color:${
            urgent ? "#E74444" : "#F2A70B"
          };">${daysRemaining} day${daysRemaining === 1 ? "" : "s"}</strong>.`
          }
        </p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#5B6472;font-size:13px;">Certificate</td>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#0E1526;font-size:13px;text-align:right;">${certificateName}</td>
          </tr>
          ${
            issuer
              ? `<tr>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#5B6472;font-size:13px;">Issued by</td>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#0E1526;font-size:13px;text-align:right;">${issuer}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#5B6472;font-size:13px;">Expiry date</td>
            <td style="padding:10px 0;border-top:1px solid #E7E2D6;color:#0E1526;font-size:13px;text-align:right;">${formatDate(
              expiryDate
            )}</td>
          </tr>
        </table>
        <a href="${appUrl}" style="display:inline-block;background:#0E1526;color:#FAF9F6;text-decoration:none;padding:12px 24px;font-size:14px;font-family:Arial,sans-serif;">Open CertVault</a>
        <p style="color:#8A93A0;font-size:12px;margin-top:28px;font-family:Arial,sans-serif;">
          You're receiving this because you set an alert for this certificate in CertVault.
        </p>
      </div>
    </div>
  </div>`;

  const text = `Hello ${recipientName || "there"},

Your certificate "${certificateName}" ${
    daysRemaining < 0
      ? `expired ${Math.abs(daysRemaining)} day${
          Math.abs(daysRemaining) === 1 ? "" : "s"
        } ago and still needs renewing`
      : daysRemaining === 0
        ? "expires today"
        : `expires in ${daysRemaining} day(s)`
  } on ${formatDate(expiryDate)}.

Open CertVault: ${appUrl}`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}
