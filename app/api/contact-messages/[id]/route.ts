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
    return NextResponse.json(
      { error: "Повідомлення не знайдено" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}
