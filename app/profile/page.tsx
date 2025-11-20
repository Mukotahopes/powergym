"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

type AppUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  points?: number;
  rank?: number; // місце в рейтингу
  totalUsers?: number; // скільки всього користувачів
  subscription?: "free" | "plus" | "premium";
};

const weekDays = ["Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб.", "Нд."];

// Статичний приклад навантаження по дням (можеш потім підʼєднати реальні дані)
const weeklyWorkouts = [6, 6, 6, 6, 6, 6, 6];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("powergymUser");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AppUser;
      setUser(parsed);
    } catch (e) {
      console.error("Cannot parse powergymUser", e);
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  const name = user.name || "Користувачу";
  const points = user.points ?? 182; // тимчасово ставимо 182 як у макеті
  const rank = user.rank ?? 7;
  const totalUsers = user.totalUsers ?? 3102;
  const subscription = user.subscription ?? "premium"; // для прикладу

  const subscriptionLabel =
    subscription === "premium"
      ? "Повний доступ"
      : subscription === "plus"
      ? "Абонемент Плюс"
      : "Без абонементу";

  const handleBuySubscription = () => {
    // поки що просто переходимо на умовну сторінку
    router.push("/subscriptions");
  };

  const handleDetailsClick = () => {
    // сюди можна повісити перехід на детальнішу статистику
    alert("Тут буде детальна статистика / історія тренувань 🙂");
  };

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-8 md:py-10">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-2">
            Особистий кабінет
          </h1>
          <p className="text-center text-sm md:text-base text-slate-700">
            Привіт, {name}! Гарного тренування сьогодні{" "}
            <span role="img" aria-label="smile">
              🙂
            </span>
          </p>

          {/* КАРТКА 1 — Бали та графік */}
          <div className="mt-8 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Ліва частина */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/3">
              <div className="text-3xl mb-1">🏋️‍♂️</div>
              <p className="text-4xl font-extrabold">{points}</p>
              <p className="mt-1 text-sm text-slate-700">
                Цього тижня +24 бали
              </p>
              <button
                onClick={handleDetailsClick}
                className="mt-4 rounded-full bg-[#8DD9BE] px-5 py-1.5 text-xs font-semibold text-black shadow-md hover:bg-[#7ACDAE]"
              >
                Детальніше
              </button>
            </div>

            {/* Права частина — "діаграма" */}
            <div className="w-full md:w-2/3">
              <div className="flex items-end justify-between h-40 px-3">
                {weeklyWorkouts.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-end gap-1"
                  >
                    <div className="flex flex-col items-center justify-end h-28">
                      <div
                        className="w-6 rounded-t-lg bg-[#8DD9BE]"
                        style={{ height: `${(value / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-700">
                      {weekDays[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* КАРТКА 2 — Абонемент + кнопка купівлі */}
          <div className="mt-6 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Ліва частина */}
            <div className="flex flex-col justify-center w-full md:w-1/2">
              <div className="text-3xl mb-1">💲</div>
              <p className="text-2xl md:text-3xl font-extrabold">
                {subscriptionLabel}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Активний до: 22 листопада 2025
              </p>
              <button
                onClick={handleBuySubscription}
                className="mt-4 w-fit rounded-full bg-[#8DD9BE] px-5 py-1.5 text-xs font-semibold text-black shadow-md hover:bg-[#7ACDAE]"
              >
                Купити / змінити абонемент
              </button>
            </div>

            {/* Права частина — картинка з абонементом */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/img/hero-gym.jpg" // заміни на свій кадр з фігми, якщо є
                  alt="Повний доступ"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-3 top-3 text-xs font-semibold text-white">
                  Повний доступ
                  <div className="text-[10px] text-slate-200">
                    Діє до 22 листопада 2025
                  </div>
                </div>
                <div className="absolute right-3 bottom-3 text-sm font-bold text-white">
                  800 грн
                </div>
              </div>
            </div>
          </div>

          {/* КАРТКА 3 — Глобальний рейтинг */}
          <div className="mt-6 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Ліва частина — місце */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2">
              <div className="text-3xl mb-1">🏅</div>
              <p className="text-3xl font-extrabold">{rank}</p>
              <p className="mt-1 text-sm text-slate-700">
                Твоє місце: {rank} з {totalUsers} учасників
              </p>
              <button
                onClick={handleDetailsClick}
                className="mt-4 rounded-full bg-[#8DD9BE] px-5 py-1.5 text-xs font-semibold text-black shadow-md hover:bg-[#7ACDAE]"
              >
                Детальніше
              </button>
            </div>

            {/* Права частина — просто заголовок/місце для майбутнього графіка */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="flex h-28 w-full max-w-xs items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
                Рейтинг серед усіх користувачів
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
