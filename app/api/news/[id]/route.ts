import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

type Params = { params: { id: string } };

// GET /api/news/:id
export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const item = await News.findById(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PATCH /api/news/:id
export async function PATCH(req: Request, { params }: Params) {
  await connectDB();
  const data = await req.json();
  const updated = await News.findByIdAndUpdate(params.id, data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/news/:id
export async function DELETE(_req: Request, { params }: Params) {
  await connectDB();
  const res = await News.findByIdAndDelete(params.id);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
