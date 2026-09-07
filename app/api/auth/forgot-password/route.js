import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a link to reset the password.";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return the same response whether or not the account exists,
    // so this endpoint can't be used to check which emails are registered.
    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      user.email
    )}`;

    await sendPasswordResetEmail({
      to: user.email,
      recipientName: user.name,
      resetUrl,
    });

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
