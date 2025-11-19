"use client";

type Trainer = {
  _id: string;
  firstName: string;
  lastName: string;
};

type Training = {
  _id: string;
  title: string;
  category: string;
  level: string;
  durationMin: number;
  description?: string;
  trainer?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  coach?: string;
};

type TrainingForm = {
  title: string;
  category: string;
  level: string;
  durationMin: number;
  description: string;
  trainerId: string;
};

const initialForm: TrainingForm = {
  title: "",
  category: "cardio",
  level: "beginner",
  durationMin: 45,
  description: "",
  trainerId: "",
};
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminTrainingsPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAdmin = localStorage.getItem("powergymAdmin") === "true";
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [router]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState<TrainingForm>(initialForm);
  const [loading, setLoading] = useState(false);

  // завантажити тренування та тренерів
  useEffect(() => {
    async function fetchAll() {
      try {
        const [trainingsRes, trainersRes] = await Promise.all([
          fetch("/api/trainings"),
          fetch("/api/trainers"),
        ]);

        const trainingsData = await trainingsRes.json();
        const trainersData = await trainersRes.json();

        setTrainings(trainingsData);
        setTrainers(trainersData);
      } catch (e) {
        console.error(e);
      }
    }
    fetchAll();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "durationMin" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Помилка:", text);
        alert("Не вдалося зберегти тренування");
        return;
      }

      const created = await res.json();
      setTrainings((prev) => [created, ...prev]);
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      alert("Не вдалося зберегти тренування");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити тренування?")) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Помилка:", text);
        alert("Не вдалося видалити тренування");
        return;
      }

      setTrainings((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Не вдалося видалити тренування");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Адмін · Тренування</h1>

      {/* Форма створення тренування */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 space-y-4 rounded-2xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-2 text-xl font-semibold">Нове тренування</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Назва</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Категорія</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="cardio">Кардіо</option>
              <option value="functional">Функціональні</option>
              <option value="strength">Силові</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Рівень</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="beginner">Початковий</option>
              <option value="intermediate">Середній</option>
              <option value="advanced">Просунутий</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Тривалість (хв)
            </label>
            <input
              type="number"
              name="durationMin"
              value={form.durationMin}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Опис
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Тренер
            </label>
            <select
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">— Оберіть тренера —</option>
              {trainers.map((tr) => (
                <option key={tr._id} value={tr._id}>
                  {tr.firstName} {tr.lastName}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Рейтинг і кількість відгуків беруться з профілю тренера
              автоматично.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#8DD9BE] px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#7ACDAE] disabled:opacity-60"
          >
            {loading ? "Збереження…" : "Додати тренування"}
          </button>
        </div>
      </form>

      {/* Список існуючих тренувань */}
      <div className="space-y-3">
        <h2 className="mb-2 text-xl font-semibold">Список тренувань</h2>
        {trainings.length === 0 && (
          <p className="text-sm text-slate-600">
            Поки що немає жодного тренування.
          </p>
        )}

        {trainings.map((t) => {
          const trainerName = t.trainer
            ? `${t.trainer.firstName} ${t.trainer.lastName}`
            : t.coach || "—";

          return (
            <div
              key={t._id}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow"
            >
              <div>
                <div className="text-sm font-semibold">
                  {t.title}{" "}
                  <span className="text-xs text-slate-500">
                    ({t.category})
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Рівень: {t.level} • Тривалість: {t.durationMin} хв • Тренер:{" "}
                  {trainerName}
                </div>
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Видалити
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
