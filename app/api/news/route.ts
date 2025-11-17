import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

// GET /api/news – всі новини
export async function GET() {
  await connectDB();
  const items = await News.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json(items);
}

// POST /api/news – створити новину
export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const {
    title,
    shortDescription,
    fullDescription,
    description, // на випадок старого поля
    image,
    tags,
  } = body;

  const short = shortDescription || description;
  const full = fullDescription || description;

  if (!title || !short || !full) {
    return NextResponse.json(
      { error: "title, shortDescription і fullDescription обовʼязкові" },
      { status: 400 }
    );
  }

  const created = await News.create({
    title,
    shortDescription: short,
    fullDescription: full,
    image,
    tags,
  });

  return NextResponse.json(created, { status: 201 });
}
