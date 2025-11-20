import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
// тут потім можна підключити модель тренувань і рахувати реальні бали

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing user ID" },
      { status: 400 }
    );
  }

  // TODO: коли зʼявиться лог тренувань, тут можна зробити aggregation
  // Зараз повертаємо 0 для кожного дня тижня
  const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];

  return NextResponse.json({ weeklyPoints });
}
