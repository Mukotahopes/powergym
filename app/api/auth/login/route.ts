import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  await connectDB();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email і пароль обовʼязкові" },
      { status: 400 }
    );
  }

  const user = (await User.findOne({ email }).lean()) as
    | {
        _id: string;
        email: string;
        name: string;
        role: string;
        password: string;
      }
    | null;

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Невірний email або пароль" },
      { status: 401 }
    );
  }

  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return NextResponse.json(safeUser, { status: 200 });
}
