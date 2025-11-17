import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

// GET /api/news – отримати всі новини
export async function GET() {
  await connectDB();
  const items = await News.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json(items);
}

// POST /api/news – створити нову новину
export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { title, description, image, tags } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "title та description обов'язкові" },
      { status: 400 }
    );
  }

  const created = await News.create({
    title,
    description,
    image,
    tags,
  });

  return NextResponse.json(created, { status: 201 });
}
