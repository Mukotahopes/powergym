"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

type LeaderItem = {
  id: string;
  name: string;
  avatar?: string | null;
  points: number;
  rank: number;
};

type BookingItem = {
  id: string;
  createdAt?: string;
};

type LocalUser = {
  id?: string;
  name?: string;
};

function getMonthDays(year: number, month: number) {
  // month: 0-11
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function SchedulePage() {
  const router = useRouter();

  const [hallCount, setHallCount] = useState<number | null>(null);
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [user, setUser] = useState<LocalUser | null>(null);
  const [bookingDates, setBookingDates] = useState<Set<string>>(
    () => new Set()
  );
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthDays = getMonthDays(currentYear, currentMonth);

  // Для підсвічування днів у календарі
  const dateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  useEffect(() => {
    // читаємо юзера з localStorage (як у профілі)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("powergymUser");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as LocalUser;
          setUser(parsed);
        } catch (e) {
          console.error("Cannot parse powergymUser:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    // 1. Завантаженість залу
    fetch("/api/gym-load")
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.count === "number") {
          setHallCount(data.count);
        }
      })
      .catch((e) => console.error("Error fetching gym-load:", e));

    // 2. Лідерборд (топ-5)
    fetch("/api/rating?top=5")
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((list: any[]) => {
        const mapped: LeaderItem[] = list.map((u) => ({
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          points: u.points,
          rank: u.rank,
        }));
        setLeaders(mapped);
      })
      .catch((e) => console.error("Error fetching rating leaderboard:", e));
  }, []);

  useEffect(() => {
    // 3. Календар: дати, коли є тренування (по бронюваннях)
    if (!user?.id) return;

    setLoadingCalendar(true);
    fetch(`/api/bookings?userId=${user.id}`)
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch (error) {
          console.error("Cannot parse bookings JSON:", error, text);
          return [];
        }
      })
      .then((list: any[]) => {
        const dates = new Set<string>();
        (list as BookingItem[]).forEach((b) => {
          if (!b.createdAt) return;
          const d = new Date(b.createdAt);
          dates.add(dateKey(d));
        });
        setBookingDates(dates);
      })
      .catch((e) => console.error("Error fetching bookings:", e))
      .finally(() => setLoadingCalendar(false));
  }, [user?.id]);

  const monthName = today.toLocaleString("uk-UA", {
    month: "long",
    year: "numeric",
  });

  const maxHall = 60; // умовна максимальна кількість людей в залі
  const hallPercent =
    hallCount != null ? Math.min(100, Math.round((hallCount / maxHall) * 100)) : 0;

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-2">
            Розклад занять
          </h1>
          <p className="text-center text-sm md:text-base text-slate-700 mb-8">
            Ознайомся з завантаженістю залу, лідербордом та своїм календарем
            тренувань.
          </p>

          {/* 1. Завантаженість залу */}
          <div className="mx-auto max-w-xl rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 mb-8">
            <h2 className="text-sm md:text-base font-extrabold mb-3">
              Завантаженість залу (зараз)
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Показує приблизну кількість людей, які зараз тренуються в залі.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#8DD9BE] transition-all"
                  style={{ width: `${hallPercent}%` }}
                />
              </div>
              <div className="text-sm font-semibold min-w-[80px] text-right">
                {hallCount != null ? `${hallCount} осіб` : "—"}
              </div>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Максимальна місткість в розрахунку: {maxHall} людей.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.8fr)]">
            {/* 2. Лідерборд */}
            <div className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5">
              <h2 className="text-sm md:text-base font-extrabold mb-3">
                Лідерборд (бали за тренування)
              </h2>
              {leaders.length === 0 ? (
                <p className="text-xs text-slate-600">
                  Поки немає достатньо даних, щоб побудувати рейтинг.
                </p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {leaders.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between rounded-2xl bg-[#E6FFF3] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{u.rank}.</span>
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                          {u.avatar ? (
                            <Image
                              src={u.avatar}
                              alt={u.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="font-semibold">{u.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-700">
                        {u.points} балів
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 3. Повний календар */}
            <div className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5">
              <h2 className="text-sm md:text-base font-extrabold mb-3">
                Календар тренувань
              </h2>

              {!user?.id ? (
                <div className="rounded-2xl bg-[#F4F7F6] px-4 py-6 text-center">
                  <p className="text-xs text-slate-700 mb-4">
                    Щоб переглянути свій персональний календар тренувань —
                    увійди в акаунт.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="rounded-full bg-[#8DD9BE] px-6 py-2 text-xs font-semibold text-black shadow hover:bg-[#7ACDAE]"
                  >
                    Увійти
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-600 mb-2">
                    {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  </p>

                  {loadingCalendar && (
                    <p className="text-[11px] text-slate-500 mb-2">
                      Завантажуємо ваші тренування...
                    </p>
                  )}

                  <div className="grid grid-cols-7 gap-1 text-[11px]">
                    {/* Назви днів */}
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
                      <div
                        key={d}
                        className="text-center font-semibold text-slate-600 mb-1"
                      >
                        {d}
                      </div>
                    ))}

                    {/* Порожні клітинки до першого дня місяця */}
                    {(() => {
                      const first = new Date(
                        currentYear,
                        currentMonth,
                        1
                      ).getDay(); // 0-Нд ... 6-Сб
                      const shift = first === 0 ? 6 : first - 1; // щоб Пн був першим
                      return Array.from({ length: shift }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ));
                    })()}

                    {/* Дні місяця */}
                    {monthDays.map((d) => {
                      const key = dateKey(d);
                      const hasTraining = bookingDates.has(key);
                      const isToday =
                        d.getDate() === today.getDate() &&
                        d.getMonth() === today.getMonth() &&
                        d.getFullYear() === today.getFullYear();

                      return (
                        <div
                          key={key}
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-full mx-auto text-[11px]",
                            hasTraining
                              ? "bg-[#8DD9BE] text-black font-semibold"
                              : "text-slate-700",
                            isToday && !hasTraining
                              ? "border border-[#8DD9BE]"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-[10px] text-slate-500">
                    Зеленим підсвічені дні, в які у вас є заплановані тренування
                    (за вашими записами).
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
