"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

type TrainingCardProps = {
  id: string;
  title: string;
  category: string;
  coachName: string;
  imageUrl: string;
};

export default function TrainingCard({
  id,
  title,
  category,
  coachName,
  imageUrl,
}: TrainingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBook = async () => {
    setMessage(null);

    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("powergymUser");
    if (!stored) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(stored) as { id?: string };
    if (!user.id) {
      router.push("/login");
      return;
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
        setMessage(data?.error || "Не вдалося записатися на тренування");
      } else {
        setMessage("Ви успішно записані на тренування 🎉");
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
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col">
        <h3 className="text-sm font-extrabold mb-1">{title}</h3>
        <p className="text-[11px] text-slate-600 mb-1">{category}</p>
        <p className="text-[11px] text-slate-700 mb-3">{coachName}</p>

        <button
          disabled={loading}
          onClick={handleBook}
          className="mt-auto w-full rounded-full bg-[#8DD9BE] py-1.5 text-[11px] font-semibold text-black shadow hover:bg-[#7ACDAE] disabled:opacity-60"
        >
          {loading ? "Запис..." : "Записатись"}
        </button>

        {message && (
          <p className="mt-1 text-[10px] text-center text-slate-600">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
