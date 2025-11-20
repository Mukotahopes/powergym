import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  const email = "admin@gmail.com";
  const password = "admin";

  // Перевіряємо чи адмін уже існує
  const existing = await User.findOne({ email });

  if (existing) {
    return NextResponse.json({
      message: "Адмін уже існує",
      admin: {
        email: existing.email,
        role: existing.role,
      },
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await User.create({
    email,
    password: hashed,
    name: "Адмін",
    role: "admin",
    avatar: "/img/avatars/default.png",
  });

  return NextResponse.json({
    message: "Адміністратора створено успішно!",
    admin: {
      email: admin.email,
      role: admin.role,
    },
  });
}
