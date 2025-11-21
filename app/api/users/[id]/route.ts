import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { pointsToAdd, date } = (await request.json()) as {
    pointsToAdd?: number;
    date?: string;
  };

  if (typeof pointsToAdd !== "number") {
    return NextResponse.json({ error: "pointsToAdd is required" }, { status: 400 });
  }

  const updated = await User.findByIdAndUpdate(
    params.id,
    { $inc: { points: pointsToAdd } },
    { new: true }
  ).lean();

  // log entry for stats
  const logDate = date ? new Date(date) : new Date();
  await (await import("@/models/PointsLog")).default.create({
    user: params.id,
    points: pointsToAdd,
    date: logDate,
  });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: String(updated._id),
    points: updated.points,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await User.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
