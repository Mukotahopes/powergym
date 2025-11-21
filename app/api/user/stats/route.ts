import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PointsLog from "@/models/PointsLog";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const now = new Date();
  const day = now.getDay(); // 0 Sun - 6 Sat
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);

  const logs = await PointsLog.find({
    user: userId,
    date: { $gte: monday, $lt: nextMonday },
  }).lean();

  const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach((log: any) => {
    const d = new Date(log.date);
    const idx = (d.getDay() + 6) % 7; // Mon=0
    weeklyPoints[idx] += Number(log.points) || 0;
  });

  return NextResponse.json({ weeklyPoints });
}
