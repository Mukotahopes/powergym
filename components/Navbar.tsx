"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-dark text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-primary font-bold text-2xl">PowerGym</Link>
      <div className="flex gap-6">
        <Link href="/trainings">Тренування</Link>
        <Link href="/ai-trainer">AI-тренер</Link>
        <Link href="/schedule">Розклад</Link>
        <Link href="/profile">Кабінет</Link>
        <Link href="/contacts">Контакти</Link>
      </div>
    </nav>
  );
}
