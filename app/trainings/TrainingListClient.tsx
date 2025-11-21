"use client";

import { useMemo, useState } from "react";
import TrainingCard from "@/components/TrainingCard";

type Training = {
  _id: string;
  title: string;
  category: "cardio" | "functional" | "strength";
  level: string;
  durationMin: number;
  description?: string;
  image?: string;
  coach?: string;
  trainer?: { firstName?: string; lastName?: string };
  startAt?: string;
  minSubscription?: "free" | "plus" | "premium";
};

const filters = [
  { id: "all", label: "Усі" },
  { id: "cardio", label: "Кардіо" },
  { id: "functional", label: "Функціональне" },
  { id: "strength", label: "Силове" },
] as const;

export default function TrainingListClient({ trainings }: { trainings: Training[] }) {
  const [active, setActive] = useState<Training | null>(null);
  const [filter, setFilter] = useState<"all" | "cardio" | "functional" | "strength">("all");

  const items = useMemo(
    () =>
      trainings.map((t) => {
        const coach =
          t.coach ||
          (t.trainer
            ? `${t.trainer.firstName ?? ""} ${t.trainer.lastName ?? ""}`.trim()
            : "");
        return { ...t, coach };
      }),
    [trainings]
  );

  const filtered = items.filter((t) => filter === "all" || t.category === filter);

  return (
    <>
      <div className="flex justify-center gap-3 mb-6">
        {filters.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setFilter(btn.id)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition shadow ${
              filter === btn.id
                ? "bg-[#8DD9BE] text-black"
                : "bg-white text-slate-800 hover:bg-[#8DD9BE]/70"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-600">Поки немає тренувань.</p>
      ) : (
        <div className="grid justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TrainingCard
              key={t._id}
              id={t._id}
              title={t.title}
              category={t.category}
              coachName={t.coach}
              imageUrl={t.image}
              startAt={t.startAt}
              minSubscription={t.minSubscription}
              onDetails={() => setActive(t)}
            />
          ))}
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-lg w-full rounded-2xl bg-white p-5 shadow-2xl space-y-3">
            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.image || "/img/hero-gym.jpg"}
                alt={active.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-xl font-extrabold">{active.title}</h3>
            <p className="text-sm text-slate-700">
              {active.category} · {active.level} · {active.durationMin} хв
            </p>
            {active.startAt && (
              <p className="text-sm text-slate-700">
                {new Date(active.startAt).toLocaleString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {active.minSubscription && (
              <p className="text-sm text-slate-700">
                Мін. абонемент: {active.minSubscription}
              </p>
            )}
            {active.coach && <p className="text-sm text-slate-700">Тренер: {active.coach}</p>}
            {active.description && (
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{active.description}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActive(null)}
                className="rounded-full border px-4 py-2 text-sm hover:bg-black/5"
              >
                Закрити
              </button>
              <button
                onClick={() => alert("Тут можна виконати запис або відкрити бронювання")}
                className="rounded-full bg-[#8DD9BE] px-4 py-2 text-sm font-semibold text-black hover:bg-[#7ACDAE]"
              >
                Записатись
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
