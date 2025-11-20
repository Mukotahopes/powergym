"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

// ======================
//  ТИПИ ПОВИННІ БУТИ ТУТ, ДО КОМПОНЕНТА
// ======================
type AppUser = {
    id?: string;
    email?: string;
    name?: string;
    avatar?: string;
    points?: number;
    rank?: number;
    totalUsers?: number;
    subscription?: "free" | "plus" | "premium";
    subscriptionUntil?: string | null;
  };
  
  type BookingItem = {
    id: string;
    status: "active" | "cancelled" | "completed";
    createdAt?: string;
    training?: {
      id: string;
      title: string;
      category?: string;
      coachName?: string;
    } | null;
  };
  type AiPlan = {
    id: string;
    text: string;
    createdAt?: string;
  };
  
// Дні тижня
const weekDays = ["Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб.", "Нд."];


// ======================
//  КОМПОНЕНТ
// ======================
export default function ProfilePage() {
    
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [weeklyPoints, setWeeklyPoints] = useState<number[]>(Array(7).fill(0));
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [aiPlan, setAiPlan] = useState<AiPlan | null>(null);

  // ======================
  //  useEffect
  // ======================
  useEffect(() => {

    
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("powergymUser");
    if (!stored) {
      router.push("/login");
      return;
    }

    const localUser = JSON.parse(stored) as AppUser;
    setUser(localUser);

    if (!localUser.id) return;

    // 1 — отримуємо дані користувача
    fetch(`/api/user/me?id=${localUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser((prev) => ({
          ...(prev ?? {}),
          ...data,
        }));
      });

    // 2 — рейтинг
    fetch(`/api/rating?id=${localUser.id}`)
      .then((res) => res.json())
      .then((ratingData) => {
        setUser((prev) => ({
          ...(prev ?? {}),
          rank: ratingData.rank,
          totalUsers: ratingData.totalUsers,
        }));
      });

    // 3 — статистика тижня
    fetch(`/api/user/stats?id=${localUser.id}`)
      .then((res) => res.json())
      .then((stats) => {
        if (Array.isArray(stats.weeklyPoints)) {
          setWeeklyPoints(stats.weeklyPoints);
        }
      });
      // 4 — мої записи на тренування
// 4 – мої записи на тренування
fetch(`/api/bookings?userId=${localUser.id}`)
  .then(async (res) => {
    if (!res.ok) {
      console.error("Bookings response not ok:", res.status);
      return [];
    }

    const text = await res.text();

    // якщо тіло порожнє – повертаємо пустий масив, щоб не ламати json()
    if (!text) return [];

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Cannot parse bookings JSON:", err, text);
      return [];
    }
  })
  .then((list: any[]) => {
    const mapped: BookingItem[] = list.map((b) => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      training: b.training
        ? {
            id: b.training.id,
            title: b.training.title,
            category: b.training.category,
            coachName: b.training.coachName,
          }
        : null,
    }));
    setBookings(mapped);
  })
  .catch((e) => console.error("Error fetching bookings:", e));

// 5 — AI-план тренувань
fetch(`/api/ai-plan?userId=${localUser.id}`)
  .then((res) => res.json())
  .then((data) => {
    if (data && data.text) {
      setAiPlan({
        id: data.id,
        text: data.text,
        createdAt: data.createdAt,
      });
    }
  })
  .catch((e) => console.error("Error fetching AI plan:", e));


  }, [router]);

  if (!user) return null;

  // ДЕСТРУКТУРИЗАЦІЯ
  const name = user.name || "Користувачу";
  const points = user.points ?? 0;
  const rank = user.rank ?? 0;
  const totalUsers = user.totalUsers ?? 0;
  const subscription = user.subscription ?? "free";
  const subscriptionUntil = user.subscriptionUntil
    ? new Date(user.subscriptionUntil)
    : null;
  const maxWeekly = Math.max(...weeklyPoints);
  const hasAnyWeeklyPoints = maxWeekly > 0;

  // Мапа підписок
  const subscriptionInfo =
  subscription === "premium"
    ? {
        label: "Повний доступ",
        description: "Ваш преміум активний",
        price: "800 грн",
        isActive: !!subscriptionUntil,
      }
    : subscription === "plus"
    ? {
        label: "Абонемент Плюс",
        description: "Доступ до тренажерів та групових тренувань",
        price: "600 грн",
        isActive: !!subscriptionUntil,
      }
    : {
        label: "Без абонементу",
        description: "Оберіть абонемент, щоб розблокувати всі можливості залу",
        price: "",
        isActive: false,
      };


  const handleBuySubscription = () => router.push("/subscriptions");

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-8">

          {/* Заголовок */}
          <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-2">
            Особистий кабінет
          </h1>
          <p className="text-center text-sm md:text-base text-slate-700">
            Привіт, {name}! Гарного тренування сьогодні 🙂
          </p>
{/* ПАНЕЛЬ КОРИСТУВАЧА */}
<div className="mt-6 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-4 flex flex-col md:flex-row items-center gap-4">
  <div className="flex items-center gap-3 w-full md:w-auto">
    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-slate-200">
      <Image
        src={user.avatar || "/img/default-avatar.png"}
        alt={name}
        fill
        className="object-cover"
      />
    </div>
    <div>
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-slate-600">{user.email}</p>
    </div>
  </div>

  <div className="flex-1 flex justify-end w-full">
    <button
      onClick={() => router.push("/trainings")}
      className="rounded-full bg-[#8DD9BE] px-5 py-1.5 text-xs font-semibold text-black shadow hover:bg-[#7ACDAE]"
    >
      Відкрити список тренувань
    </button>
  </div>
</div>

          {/* ===========================
             КАРТКА 1 — БАЛИ + ГРАФІК
          ============================ */}
          <div className="mt-8 rounded-3xl bg-white shadow-xl px-6 py-5 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="text-3xl mb-1">🏋️‍♂️</div>
              <p className="text-4xl font-extrabold">{points}</p>
              <p className="text-sm text-slate-700 mt-1">
                Цього тижня {hasAnyWeeklyPoints ? "" : "ще"} 0 балів
              </p>
            </div>

            <div className="w-full md:w-2/3">
              {!hasAnyWeeklyPoints ? (
                <div className="flex h-40 items-center justify-center text-xs text-slate-500">
                  За цей тиждень ще не нараховано балів
                </div>
              ) : (
                <div className="flex items-end justify-between h-40 px-3">
                  {weeklyPoints.map((v, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="h-28 flex items-end">
                        <div
                          className="w-6 rounded-t-lg bg-[#8DD9BE]"
                          style={{ height: `${(v / maxWeekly) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-700">
                        {weekDays[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===========================
             КАРТКА 2 — АБОНЕМЕНТ
          ============================ */}
          <div className="mt-6 rounded-3xl bg-white shadow-xl px-6 py-5 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col w-full md:w-1/2">
              <div className="text-3xl mb-1">💲</div>
              <p className="text-2xl md:text-3xl font-extrabold">
  {subscriptionInfo.label}
</p>
<p className="mt-1 text-sm text-slate-700">
  {subscriptionInfo.isActive && subscriptionUntil
    ? `Дійсний до: ${subscriptionUntil.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : subscriptionInfo.description}
</p>


              <button
                onClick={handleBuySubscription}
                className="mt-4 w-fit rounded-full bg-[#8DD9BE] px-5 py-1.5 text-xs font-semibold text-black"
              >
                Купити / змінити абонемент
              </button>
            </div>

<div className="w-full md:w-1/2 flex justify-center">
              <div className="relative h-40 w-full max-w-xs rounded-2xl overflow-hidden shadow-lg">
                {/* Картинка */}
                <Image
                  src="/img/hero-gym.jpg"
                  alt="sub"
                  fill
                  className="object-cover"
                />

                {/* Темний градієнт зверху для читабельності тексту */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Текст зверху зліва */}
                <div className="absolute left-3 top-3 text-xs font-semibold text-white">
                  {subscriptionInfo.isActive ? subscriptionInfo.label : "Повний доступ"}
                  {subscriptionInfo.isActive && subscriptionUntil && (
                    <div className="text-[10px] text-slate-200">
                      Дійсний до{" "}
                      {subscriptionUntil.toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {/* Ціна знизу справа */}
                {subscriptionInfo.price && (
                  <div className="absolute right-3 bottom-3 text-sm font-bold text-white">
                    {subscriptionInfo.price}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ===========================
             КАРТКА 3 — РЕЙТИНГ
          ============================ */}
          <div className="mt-6 rounded-3xl bg-white shadow-xl px-6 py-5 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="text-3xl mb-1">🏅</div>
              <p className="text-3xl font-extrabold">{rank}</p>
              <p className="text-sm text-slate-700 mt-1">
                Твоє місце: {rank} з {totalUsers} учасників
              </p>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="flex h-28 w-full max-w-xs items-center justify-center rounded-2xl bg-slate-50 border border-dashed text-sm text-slate-500">
                Рейтинг серед усіх користувачів
              </div>
            </div>
          </div>
{/* МОЇ ЗАПИСИ НА ТРЕНУВАННЯ */}
<div className="mt-8 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5">
  <h2 className="text-base md:text-lg font-extrabold mb-3">
    Мої записи на тренування
  </h2>

  {bookings.length === 0 ? (
    <p className="text-xs text-slate-600">
      Ви ще не записувались на тренування. Відкрийте список тренувань і
      оберіть те, що вам підходить.
    </p>
  ) : (
    <ul className="space-y-2">
      {bookings.map((b) => {
        const date =
          b.createdAt &&
          new Date(b.createdAt).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

        const statusLabel =
          b.status === "completed"
            ? "Завершено"
            : b.status === "cancelled"
            ? "Скасовано"
            : "Активний";

        return (
          <li
            key={b.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs"
          >
            <div>
              <p className="font-semibold">
                {b.training?.title || "Тренування"}
              </p>
              <p className="text-slate-600">
                {b.training?.category}{" "}
                {b.training?.coachName &&
                  `• тренер: ${b.training.coachName}`}
              </p>
            </div>
            <div className="mt-1 md:mt-0 text-right">
              {date && (
                <p className="text-[11px] text-slate-500 mb-0.5">{date}</p>
              )}
              <p className="text-[11px] font-semibold text-slate-700">
                Статус: {statusLabel}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  )}
</div>
{/* AI-план тренувань */}
<div className="mt-6 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5">
  <h2 className="text-base md:text-lg font-extrabold mb-3">
    AI-план тренувань
  </h2>

  {!aiPlan ? (
    <p className="text-xs text-slate-600">
      Ви ще не зберігали AI-план. Створіть його на сторінці AI-тренера.
    </p>
  ) : (
    <>
      {aiPlan.createdAt && (
        <p className="text-[11px] text-slate-500 mb-2">
          Останнє оновлення:{" "}
          {new Date(aiPlan.createdAt).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-xs whitespace-pre-wrap text-slate-800">
        {aiPlan.text}
      </div>
    </>
  )}
</div>

        </section>
      </div>

      <Footer />
    </main>
  );
}
