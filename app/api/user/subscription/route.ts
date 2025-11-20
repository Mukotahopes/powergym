import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

type PlanId = "free" | "plus" | "premium";

export async function PATCH(request: Request) {
  await connectDB();

  const { userId, subscription } = (await request.json()) as {
    userId?: string;
    subscription?: PlanId;
  };

  if (!userId || !subscription) {
    return NextResponse.json(
      { error: "userId and subscription are required" },
      { status: 400 }
    );
  }

  if (!["free", "plus", "premium"].includes(subscription)) {
    return NextResponse.json(
      { error: "Invalid subscription type" },
      { status: 400 }
    );
  }

  // скільки днів діє кожен тариф
  const durations: Record<PlanId, number> = {
    free: 0,
    plus: 30,
    premium: 30,
  };

  const days = durations[subscription];
  let subscriptionUntil: Date | null = null;

  if (days > 0) {
    const now = new Date();
    subscriptionUntil = new Date(
      now.getTime() + days * 24 * 60 * 60 * 1000
    );
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { subscription, subscriptionUntil },
    { new: true }
  ).lean();

  if (Array.isArray(updated)) {
    return NextResponse.json(
      { error: "Unexpected result: multiple users found" },
      { status: 500 }
    );
  }

  if (!updated) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: String(updated._id),
    subscription: updated.subscription,
    subscriptionUntil: updated.subscriptionUntil,
  });
}
