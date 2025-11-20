import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PersonalTraining from "@/models/PersonalTraining";

// GET — всі тренування користувача
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const sessions = await PersonalTraining.find({ userId }).sort({ date: 1 }).lean();

  return NextResponse.json(sessions);
}

// POST — адмін створює тренування
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { userId, trainerId, date, type, comment } = body;

  const session = await PersonalTraining.create({
    userId,
    trainerId,
    date,
    type,
    comment,
  });

  return NextResponse.json(session, { status: 201 });
}
