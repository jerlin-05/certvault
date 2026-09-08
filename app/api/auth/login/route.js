import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signSession, setSessionCookie } from "@/lib/auth";
import { issueOtp, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      const canResend =
        !user.otpLastSentAt ||
        Date.now() - user.otpLastSentAt.getTime() >= OTP_RESEND_COOLDOWN_MS;
      if (canResend) {
        const otp = issueOtp(user);
        await user.save();
        await sendOtpEmail({ to: user.email, recipientName: user.name, otp });
      }
      return NextResponse.json(
        {
          error: "Please verify your email to continue.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    const token = signSession(user);
    setSessionCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong signing you in." },
      { status: 500 }
    );
  }
}

