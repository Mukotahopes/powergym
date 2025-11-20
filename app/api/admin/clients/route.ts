import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .select("name email role subscription subscriptionUntil createdAt")
    .lean();

  return NextResponse.json(users);
}
