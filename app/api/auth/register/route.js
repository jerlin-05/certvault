import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { issueOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are all required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      // Account exists but was never verified — refresh it and resend a code
      // instead of blocking the person from ever finishing sign up.
      existing.name = name;
      existing.password = await bcrypt.hash(password, 10);
      const otp = issueOtp(existing);
      await existing.save();
      await sendOtpEmail({ to: existing.email, recipientName: existing.name, otp });

      return NextResponse.json({
        requiresVerification: true,
        email: existing.email,
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    const otp = issueOtp(user);
    await user.save();

    await sendOtpEmail({ to: user.email, recipientName: user.name, otp });

    return NextResponse.json({
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong creating your account." },
      { status: 500 }
    );
  }
}
