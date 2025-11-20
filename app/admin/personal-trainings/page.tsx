"use client";

import { useEffect, useState } from "react";

type TrainerOption = {
  id: string;
  name: string;
};

type PersonalTrainingItem = {
  id: string;
  title: string;
  date?: string;
  user?: { name: string; email: string } | null;
  trainer?: { name: string } | null;
  status?: string;
};

export default function AdminPersonalTrainingsPage() {
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [list, setList] = useState<PersonalTrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    userEmail: "",
    trainerId: "",
    title: "",
    plan: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    // тренери
    fetch("/api/trainers")
      .then(async (res) => (res.ok ? res.json() : []))
      .then((list: any[]) => {
        const mapped: TrainerOption[] = list.map((t) => ({
          id: String(t._id ?? t.id),
          name: `${t.firstName} ${t.lastName}`,
        }));
        setTrainers(mapped);
      })
      .catch((e) => console.error("Error fetching trainers:", e));

    // список персональних тренувань (усі)
    fetch("/api/personal-trainings")
      .then(async (res) => (res.ok ? res.json() : []))
      .then((list: any[]) => {
        const mapped: PersonalTrainingItem[] = list.map((pt) => ({
          id: String(pt.id ?? pt._id),
          title: pt.title,
          date: pt.date,
          user: pt.user,
          trainer: pt.trainer,
          status: pt.status,
        }));
        setList(mapped);
      })
      .catch((e) =>
        console.error("Error fetching personal trainings:", e)
      )
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (
      !form.userEmail ||
      !form.trainerId ||
      !form.title ||
      !form.plan ||
      !form.date
    ) {
      setError("Заповни всі поля форми.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/personal-trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Не вдалося створити тренування.");
      } else {
        setInfo("Персональне тренування призначено ✅");
        // оновити список (мінімально)
        setList((prev) => [
          {
            id: data.id,
            title: form.title,
            date: form.date,
            user: { name: "", email: form.userEmail },
            trainer: {
              name:
                trainers.find((t) => t.id === form.trainerId)?.name ??
                "Тренер",
            },
          },
          ...prev,
        ]);
        setForm({
          userEmail: "",
          trainerId: "",
          title: "",
          plan: "",
          date: "",
        });
      }
    } catch (e) {
      console.error(e);
      setError("Сталася помилка. Спробуй ще раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-extrabold mb-4">
        Персональні тренування
      </h1>

      <p className="text-sm text-slate-700 mb-4">
        Тут ти можеш призначити клієнту персональне тренування з конкретним
        тренером. Клієнт побачить це тренування у своєму профілі.
      </p>

      {/* Форма */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 mb-6 space-y-3 text-sm"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs mb-1">Email клієнта</label>
            <input
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              placeholder="client@example.com"
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Тренер</label>
            <select
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8DD9BE] bg-white"
            >
              <option value="">Оберіть тренера</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Назва тренування</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Персональне тренування"
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Дата та час</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs mb-1">План тренування</label>
          <textarea
            name="plan"
            value={form.plan}
            onChange={handleChange}
            rows={4}
            placeholder="Опиши основні етапи тренування, акценти, вправи..."
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#8DD9BE] resize-y"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
        {info && (
          <p className="text-xs text-emerald-700">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#8DD9BE] px-6 py-2 text-xs font-semibold text-black shadow-md hover:bg-[#7ACDAE] disabled:opacity-60"
        >
          {saving ? "Зберігаємо..." : "Призначити тренування"}
        </button>
      </form>

      {/* Список існуючих персональних тренувань */}
      <div className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)] px-6 py-5 text-sm">
        <h2 className="font-extrabold mb-3">Останні персональні тренування</h2>

        {loading ? (
          <p className="text-xs text-slate-600">Завантаження...</p>
        ) : list.length === 0 ? (
          <p className="text-xs text-slate-600">
            Персональних тренувань поки що немає.
          </p>
        ) : (
          <div className="space-y-2">
            {list.map((pt) => (
              <div
                key={pt.id}
                className="rounded-2xl bg-[#F4F7F6] px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-1"
              >
                <div>
                  <div className="font-semibold">{pt.title}</div>
                  <div className="text-[11px] text-slate-600">
                    Клієнт: {pt.user?.name || pt.user?.email || "—"}{" "}
                    {pt.user?.email && `(${pt.user.email})`}
                    <br />
                    Тренер: {pt.trainer?.name || "—"}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  {pt.date &&
                    new Date(pt.date).toLocaleString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {pt.status && (
                    <div className="mt-1 text-xs">
                      Статус: <span className="font-semibold">{pt.status}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
