import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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

  const user = (await User.findById(userId).lean()) as
    | {
        _id: unknown;
        name?: string;
        email: string;
        avatar?: string;
        subscription?: "free" | "plus" | "premium";
        subscriptionUntil?: Date | null;
        points?: number;
      }
    | null;

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: String(user._id),
    name: user.name ?? "",
    email: user.email,
    avatar: user.avatar ?? "/img/default-avatar.png",
    subscription: user.subscription ?? "free",
    subscriptionUntil: user.subscriptionUntil ?? null,
    points: user.points ?? 0,
  });
}
