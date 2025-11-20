import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

// Дуже проста логіка: кількість "активних" бронювань ≈ людей у залі.
// Потім зможеш замінити на справжні турнікети / чекин.
export async function GET() {
  try {
    await connectDB();

    const count = await Booking.countDocuments({ status: "active" });

    return NextResponse.json(
      {
        count, // скільки людей зараз у залі
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("GET /api/gym-load error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
