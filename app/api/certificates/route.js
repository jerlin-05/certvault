import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await connectDB();
  const certificates = await Certificate.find({ owner: user.id }).sort({
    expiryDate: 1,
  });

  return NextResponse.json({ certificates });
}

export async function POST(request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      issuer,
      category,
      notes,
      issueDate,
      expiryDate,
      alertDaysBefore,
      image, // { data, contentType } base64
    } = body;

    if (!name || !expiryDate) {
      return NextResponse.json(
        { error: "Certificate name and expiry date are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const certificate = await Certificate.create({
      owner: user.id,
      name,
      issuer,
      category,
      notes,
      issueDate: issueDate || undefined,
      expiryDate,
      alertDaysBefore: alertDaysBefore || 30,
      image: image?.data
        ? { data: image.data, contentType: image.contentType }
        : undefined,
    });

    return NextResponse.json({ certificate }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not save the certificate." },
      { status: 500 }
    );
  }
}
