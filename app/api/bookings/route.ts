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
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ user: userId })
      .populate("training", "title category coachName")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = bookings.map((b: any) => ({
      id: String(b._id),
      status: b.status,
      createdAt: b.createdAt,
      training: b.training
        ? {
            id: String(b.training._id),
            title: b.training.title,
            category: b.training.category,
            coachName: b.training.coachName,
          }
        : null,
    }));

    // навіть якщо немає записів – повертаємо []
    return NextResponse.json(mapped, { status: 200 });
  } catch (e) {
    console.error("GET /api/bookings error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const allowed = ((training as any).allowedSubscriptions ??
      ["free", "plus", "premium"]) as PlanId[];

    if (userSub && !allowed.includes(userSub)) {
      return NextResponse.json(
        {
          error:
            "Ваш абонемент не дозволяє записуватись на це тренування",
        },
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
