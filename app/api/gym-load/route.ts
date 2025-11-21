import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GymLoad from "@/models/GymLoad";

export async function GET() {
  try {
    await connectDB();
    const doc = await GymLoad.findOne().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ count: doc?.count ?? 0 }, { status: 200 });
  } catch (e) {
    console.error("GET /api/gym-load error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { count } = (await request.json()) as { count?: number };
    const safeCount = Number(count) || 0;

    const updated = await GymLoad.findOneAndUpdate(
      {},
      { count: safeCount },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ count: updated?.count ?? safeCount }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/gym-load error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
