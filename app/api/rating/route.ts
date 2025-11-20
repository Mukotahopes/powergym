import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // Явно кажемо TS, що тут масив з _id та points
  const users = (await User.find().select("points").lean()) as {
    _id: unknown;
    points?: number;
  }[];

  const sorted = users
    .map((u) => ({
      id: String(u._id),
      points: u.points ?? 0,
    }))
    .sort((a, b) => b.points - a.points);

  const totalUsers = sorted.length;
  const index = sorted.findIndex((u) => u.id === userId);
  const rank = index === -1 ? totalUsers : index + 1;

  return NextResponse.json({ rank, totalUsers });
}
