import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const topParam = searchParams.get("top");

    // Дістаємо всіх користувачів, сортуємо по points
    const users = await User.find({ role: "user" })
    .sort({ points: -1 })
    .lean();

  const mapped = users.map((u: any, index: number) => ({
    id: String(u._id),
    name: u.name,
    points: u.points ?? 0,
    rank: index + 1,
  }));

    const totalUsers = users.length;

    // --- Режим лідерборду ---
    if (topParam) {
      const limit = Number(topParam) || 5;
      const top = users.slice(0, limit).map((u, idx) => ({
        id: String(u._id),
        name: u.name || "Користувач",
        avatar: u.avatar || null,
        points: u.points || 0,
        rank: idx + 1,
      }));

      return NextResponse.json(mapped, { status: 200 });
    }

    // --- Режим "ранк одного користувача" ---
    if (!userId) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const index = users.findIndex((u) => String(u._id) === userId);
    const user = users.find((u) => String(u._id) === userId);

    const rank = index === -1 ? null : index + 1;
    const points = user?.points || 0;

    return NextResponse.json(
      { rank, totalUsers, points },
      { status: 200 }
    );
  } catch (e) {
    console.error("GET /api/rating error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
