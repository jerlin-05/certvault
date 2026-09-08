import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import { getSessionUser } from "@/lib/auth";

async function findOwned(id, userId) {
  return Certificate.findOne({ _id: id, owner: userId });
}

export async function GET(request, { params }) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await connectDB();
  const certificate = await findOwned(params.id, user.id);
  if (!certificate) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ certificate });
}

export async function PUT(request, { params }) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const certificate = await findOwned(params.id, user.id);
    if (!certificate) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const {
      name,
      issuer,
      category,
      notes,
      issueDate,
      expiryDate,
      alertDaysBefore,
      image,
      archived,
    } = body;

    if (archived !== undefined) certificate.archived = archived;
    if (name !== undefined) certificate.name = name;
    if (issuer !== undefined) certificate.issuer = issuer;
    if (category !== undefined) certificate.category = category;
    if (notes !== undefined) certificate.notes = notes;
    if (issueDate !== undefined) certificate.issueDate = issueDate || null;
    if (alertDaysBefore !== undefined)
      certificate.alertDaysBefore = alertDaysBefore;
    if (image?.data) {
      certificate.image = { data: image.data, contentType: image.contentType };
    }

    // If the expiry date changes, reset alert history so new alerts can fire.
    if (
      expiryDate !== undefined &&
      new Date(expiryDate).getTime() !==
        new Date(certificate.expiryDate).getTime()
    ) {
      certificate.expiryDate = expiryDate;
      certificate.alertsSent = [];
    }

    await certificate.save();

    return NextResponse.json({ certificate });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not update the certificate." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await connectDB();
  const certificate = await findOwned(params.id, user.id);
  if (!certificate) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await certificate.deleteOne();
  return NextResponse.json({ ok: true });
}
