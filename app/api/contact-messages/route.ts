import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  await connectDB();

  const messages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  await connectDB();

  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Будь ласка, заповніть всі поля" },
      { status: 400 }
    );
  }

  const created = await ContactMessage.create({
    name,
    email,
    message,
  });

  return NextResponse.json(
    { ok: true, id: created._id.toString() },
    { status: 201 }
  );
  
}
