"use client";

import { FormEvent, useEffect, useState } from "react";

type Trainer = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const loadTrainers = () => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((error) => {
        console.error("Failed to load trainers", error);
        setStatus("Не вдалося завантажити тренерів");
      });
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {
      setStatus("Введіть імʼя та прізвище тренера");
      return;
    }

    const res = await fetch("/api/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        avatar: avatar.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setStatus(body.error || "Помилка при збереженні тренера");
      return;
    }

    setFirstName("");
    setLastName("");
    setAvatar("");
    setStatus("Тренера додано успішно");
    loadTrainers();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-extrabold mb-4">Тренери</h1>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-5">
        <section className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] px-5 py-5">
          <h2 className="font-semibold mb-3">Додати нового тренера</h2>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm">
                Імʼя
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Імʼя"
                  required
                />
              </label>
              <label className="text-sm">
                Прізвище
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Прізвище"
                  required
                />
              </label>
            </div>
            <label className="text-sm block">
              Посилання на аватар (необовʼязково)
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-slate-800 transition"
            >
              Додати тренера
            </button>
            {status && <div className="text-xs text-slate-600">{status}</div>}
          </form>
        </section>

        <section className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] px-5 py-5">
          <h2 className="font-semibold mb-3">Усі тренери</h2>
          {trainers.length === 0 ? (
            <p className="text-sm text-slate-600">Поки немає жодного тренера.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {trainers.map((trainer) => (
                <li
                  key={trainer._id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                >
                  <div>
                    <div className="font-semibold">
                      {trainer.firstName} {trainer.lastName}
                    </div>
                    {trainer.avatar && (
                      <div className="text-xs text-slate-500 break-all">
                        {trainer.avatar}
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">ID: {trainer._id}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
