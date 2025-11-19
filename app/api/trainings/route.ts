import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Training from "@/models/Training";
import Trainer from "@/models/Trainer";

export async function GET() {
  await connectDB();

  const trainings = await Training.find()
    .populate("trainer")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(trainings);
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();

  const {
    title,
    category,
    level,
    durationMin,
    description,
    trainerId, // важливо!
  } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Поле title обовʼязкове" },
      { status: 400 }
    );
  }

  // тренер — додатково
  let coachName: string | undefined = undefined;

  if (trainerId) {
    const trainer = (await Trainer.findById(trainerId).lean()) as
      | { firstName?: string; lastName?: string }
      | null;

    if (trainer?.firstName && trainer?.lastName) {
      coachName = `${trainer.firstName} ${trainer.lastName}`;
    }
  }

  const training = await Training.create({
    title,
    category,
    level,
    durationMin: Number(durationMin),
    description,
    trainer: trainerId || undefined,
    coach: coachName,
  });

  // populate тренера після створення
  const populated = await training.populate("trainer");

  return NextResponse.json(populated, { status: 201 });
}
