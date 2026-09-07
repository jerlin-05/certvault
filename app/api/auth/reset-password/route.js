import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
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

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
