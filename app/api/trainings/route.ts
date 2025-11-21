import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Training from "@/models/Training";
import Trainer from "@/models/Trainer";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
}

export async function GET() {
  await connectDB();

  const trainings = await Training.find()
    .populate("trainer")
    .sort({ startAt: 1, createdAt: -1 })
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
    trainerId,
    image,
    startAt,
    minSubscription,
  } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

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
    image,
    startAt: startAt ? new Date(startAt) : undefined,
    minSubscription: minSubscription || "free",
    trainer: trainerId || undefined,
    coach: coachName,
    slug: slugify(title),
  });

  const populated = await training.populate("trainer");

  return NextResponse.json(populated, { status: 201 });
}
