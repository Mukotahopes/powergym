import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

// GET /api/news  → всі новини
export async function GET() {
  await connectDB();
  const list = await News.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json(list);
}

// POST /api/news  → створити новину
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  if (!body?.title || !body?.description) {
    return NextResponse.json({ error: "title & description required" }, { status: 400 });
  }
  const created = await News.create(body);
  return NextResponse.json(created, { status: 201 });
}
