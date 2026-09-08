import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { issueOtp, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const GENERIC_MESSAGE = "If that account needs verifying, a new code is on its way.";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.emailVerified) {
      // Don't reveal whether the account exists or is already verified.
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    if (
      user.otpLastSentAt &&
      Date.now() - user.otpLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
    ) {
      const waitMs =
        OTP_RESEND_COOLDOWN_MS - (Date.now() - user.otpLastSentAt.getTime());
      return NextResponse.json(
        {
          error: `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code.`,
        },
        { status: 429 }
      );
    }

    const otp = issueOtp(user);
    await user.save();
    await sendOtpEmail({ to: user.email, recipientName: user.name, otp });

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
