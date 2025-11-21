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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  let coachName: string | undefined = undefined;
  if (trainerId) {
    const trainer = (await Trainer.findById(trainerId).lean()) as
      | { firstName?: string; lastName?: string }
      | null;
    if (trainer?.firstName && trainer?.lastName) {
      coachName = `${trainer.firstName} ${trainer.lastName}`;
    }
  }

  const updated = await Training.findByIdAndUpdate(
    params.id,
    {
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
      slug: title ? slugify(title) : undefined,
    },
    { new: true }
  )
    .populate("trainer")
    .lean();

  if (!updated) {
    return NextResponse.json({ error: "Training not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Training.findByIdAndDelete(params.id);
  return new NextResponse(null, { status: 204 });
}
