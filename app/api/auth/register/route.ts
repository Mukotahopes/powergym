import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { email, name, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email і пароль обовʼязкові" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json(
      { error: "Користувач з таким email вже існує" },
      { status: 409 }
    );
  }

  const user = await User.create({
    email,
    name,
    password, // простий варіант для диплома
    role: "user",
  });

  const safeUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return NextResponse.json(safeUser, { status: 201 });
}
