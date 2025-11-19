import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trainer from "@/models/Trainer";

export async function GET() {
  await connectDB();
  const trainers = await Trainer.find().sort({ lastName: 1 }).lean();
  return NextResponse.json(trainers);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();

  const { firstName, lastName, avatar } = body;

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "firstName і lastName обовʼязкові" },
      { status: 400 }
    );
  }

  const trainer = await Trainer.create({
    firstName,
    lastName,
    avatar,
  });

  return NextResponse.json(trainer, { status: 201 });
}
