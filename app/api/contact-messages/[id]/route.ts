import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { isRead } = await request.json();

  const updated = await ContactMessage.findByIdAndUpdate(
    params.id,
    { isRead: !!isRead },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const deleted = await ContactMessage.findByIdAndDelete(params.id).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
