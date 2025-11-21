import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainer from "@/models/Trainer";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await request.json();
  const { firstName, lastName, avatar } = body;

  const updated = await Trainer.findByIdAndUpdate(
    params.id,
    { firstName, lastName, avatar },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: String(updated._id),
    firstName: updated.firstName,
    lastName: updated.lastName,
    avatar: updated.avatar,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await Trainer.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
