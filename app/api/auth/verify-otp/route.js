import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashOtp, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.otpHash) {
      return NextResponse.json(
        { error: "No pending verification for this email." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      const token = signSession(user);
      setSessionCookie(token);
      return NextResponse.json({
        user: { id: user._id, name: user.name, email: user.email },
      });
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json(
        { error: "That code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const isMatch = hashOtp(String(otp).trim()) === user.otpHash;
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
    }

    user.emailVerified = true;
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    const token = signSession(user);
    setSessionCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong verifying your email." },
      { status: 500 }
    );
  }
}
