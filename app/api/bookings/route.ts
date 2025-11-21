import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Training from "@/models/Training";
import Booking from "@/models/Booking";

type PlanId = "free" | "plus" | "premium";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("training", "title category coach startAt minSubscription image")
      .sort({ createdAt: -1 })
      .lean();

    const now = Date.now();
    const mapped = bookings
      .filter((b: any) => b.training && (!b.training.startAt || new Date(b.training.startAt).getTime() >= now))
      .map((b: any) => ({
        id: String(b._id),
        status: b.status,
        createdAt: b.createdAt,
        training: b.training
          ? {
              id: String(b.training._id),
              title: b.training.title,
              category: b.training.category,
              coachName: b.training.coach,
              startAt: b.training.startAt,
              minSubscription: b.training.minSubscription,
              image: b.training.image,
            }
          : null,
      }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (e) {
    console.error("GET /api/bookings error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, trainingId } = (await req.json()) as {
      userId?: string;
      trainingId?: string;
    };

    if (!userId || !trainingId) {
      return NextResponse.json(
        { error: "userId and trainingId are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).lean();
    const training = await Training.findById(trainingId).lean();

    if (!user || !training) {
      return NextResponse.json(
        { error: "User or training not found" },
        { status: 404 }
      );
    }

    const userSub = (user as any).subscription as PlanId | undefined;
    const minRequired = ((training as any).minSubscription ?? "free") as PlanId;
    const order: Record<PlanId, number> = { free: 0, plus: 1, premium: 2 };

    if (userSub && order[userSub] < order[minRequired]) {
      return NextResponse.json(
        { error: "Ваш абонемент не дозволяє запис на це тренування" },
        { status: 403 }
      );
    }

    const booking = await Booking.create({
      user: userId,
      training: trainingId,
    });

    return NextResponse.json(
      {
        id: booking._id.toString(),
        status: booking.status,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/bookings error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
