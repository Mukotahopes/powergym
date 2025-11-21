"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

type TrainingCardProps = {
  id: string;
  title: string;
  category: string;
  coachName: string;
  imageUrl?: string;
  startAt?: string;
  minSubscription?: "free" | "plus" | "premium";
  onDetails?: () => void;
};

const subOrder: Record<"free" | "plus" | "premium", number> = {
  free: 0,
  plus: 1,
  premium: 2,
};

export default function TrainingCard({
  id,
  title,
  category,
  coachName,
  imageUrl,
  startAt,
  minSubscription,
  onDetails,
}: TrainingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startDate = startAt ? new Date(startAt) : null;
  const isPast = startDate ? startDate.getTime() < Date.now() : false;

  const handleBook = async () => {
    setMessage(null);

    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("powergymUser");
    if (!stored) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(stored) as { id?: string; subscription?: string };
    if (!user.id) {
      router.push("/login");
      return;
    }

    // subscription check on client for UX
    if (minSubscription && user.subscription) {
      const uSub = (user.subscription as any) as "free" | "plus" | "premium";
      if (subOrder[uSub] < subOrder[minSubscription]) {
        setMessage("Ваш абонемент не дозволяє запис на це тренування.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, trainingId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "Не вдалося забронювати тренування.");
      } else {
        setMessage("Запис створено! Перевірте свій профіль.");
      }
    } catch (e) {
      console.error(e);
      setMessage("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
        <Image
          src={imageUrl || "/img/hero-gym.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col">
        <h3 className="text-sm font-extrabold mb-1">{title}</h3>
        <p className="text-[11px] text-slate-600 mb-1">{category}</p>
        {startDate && (
          <p className="text-[11px] text-slate-700 mb-1">
            {startDate.toLocaleString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
        {minSubscription && (
          <p className="text-[11px] text-slate-600 mb-1">
            Мін. абонемент: {minSubscription}
          </p>
        )}
        <p className="text-[11px] text-slate-700 mb-3">{coachName}</p>

        <button
          disabled={loading || isPast}
          onClick={handleBook}
          className="w-full rounded-full bg-[#8DD9BE] py-1.5 text-[11px] font-semibold text-black shadow hover:bg-[#7ACDAE] disabled:opacity-60"
        >
          {isPast ? "Тренування минуло" : loading ? "Бронюємо..." : "Записатись"}
        </button>

        {onDetails && (
          <button
            onClick={onDetails}
            className="mt-2 w-full rounded-full border border-black/10 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-black/5"
          >
            Детальніше
          </button>
        )}

        {message && (
          <p className="mt-1 text-[10px] text-center text-slate-600">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
