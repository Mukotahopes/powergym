import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("_id name email role subscription subscriptionUntil")
    .lean();

  const mapped = users.map((u: any) => ({
    id: String(u._id),
    name: u.name ?? "",
    email: u.email ?? "",
    role: u.role ?? "user",
    subscription: u.subscription ?? "free",
    subscriptionUntil: u.subscriptionUntil ?? null,
  }));

  return NextResponse.json(mapped);
}
