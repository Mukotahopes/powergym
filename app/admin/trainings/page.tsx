"use client";

import { useEffect, useState } from "react";

type Trainer = {
  id: string;
  firstName: string;
  lastName: string;
};

type Training = {
  id: string;
  title: string;
  category: string;
  level: string;
  durationMin: number;
  description?: string;
  image?: string;
  coach?: string;
  startAt?: string;
  trainerId?: string;
  minSubscription?: "free" | "plus" | "premium";
};

const initialForm: Omit<Training, "id"> = {
  title: "",
  category: "cardio",
  level: "beginner",
  durationMin: 45,
  description: "",
  trainerId: "",
  startAt: "",
  minSubscription: "" as "" | "free" | "plus" | "premium",
};

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [trainingsRes, trainersRes] = await Promise.all([
        fetch("/api/trainings"),
        fetch("/api/trainers"),
      ]);
      const trainingsData = await trainingsRes.json();
      const trainersData = await trainersRes.json();
      setTrainings(
        trainingsData.map((t: any) => ({
          id: String(t._id ?? t.id),
          title: t.title,
          category: t.category,
          level: t.level,
          durationMin: t.durationMin,
          description: t.description,
          image: t.image,
          startAt: t.startAt,
          trainerId: t.trainer?._id || t.trainerId,
          minSubscription: t.minSubscription || "free",
          coach:
            t.coach ||
            (t.trainer ? `${t.trainer.firstName ?? ""} ${t.trainer.lastName ?? ""}`.trim() : ""),
        }))
      );
      setTrainers(
        trainersData.map((tr: any) => ({
          id: String(tr._id ?? tr.id),
          firstName: tr.firstName,
          lastName: tr.lastName,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "durationMin" ? Number(value) || 0 : value,
    }));
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  const handleEdit = (t: Training) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      category: t.category,
      level: t.level,
      durationMin: t.durationMin,
      description: t.description || "",
      trainerId: t.trainerId || "",
      startAt: t.startAt ? t.startAt.slice(0, 16) : "",
      minSubscription: (t.minSubscription as Training["minSubscription"]) || "",
    });
    setPreview(t.image || null);
    setFile(null);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPreview(null);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl: string | undefined = preview || undefined;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const upload = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        if (!upload.ok) {
          const err = await upload.json().catch(() => ({}));
          throw new Error(err.error || "Cannot upload image");
        }
        const data = await upload.json();
        imageUrl = data.url;
      }

      const payload = { ...form, image: imageUrl };

      if (editingId) {
        const res = await fetch(`/api/trainings/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
      } else {
        const res = await fetch("/api/trainings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
      }

      await loadData();
      resetForm();
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
      const res = await fetch(`/api/trainings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTrainings((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      alert("Не вдалося видалити");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="mb-2 text-3xl font-extrabold">Адмін · Тренування</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.12)] border border-black/5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingId ? "Редагувати тренування" : "Нове тренування"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-600 underline"
            >
              Скасувати редагування
            </button>
          )}
        </div>

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
              <option value="functional">Функціональне</option>
              <option value="strength">Силове</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
            <label className="mb-1 block text-sm font-medium">Тривалість (хв)</label>
            <input
              type="number"
              name="durationMin"
              value={form.durationMin}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Дата і час</label>
            <input
              type="datetime-local"
              name="startAt"
              value={form.startAt}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Мін. абонемент</label>
            <select
              name="minSubscription"
              value={form.minSubscription}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              required
            >
              <option value="">— Оберіть абонемент —</option>
              <option value="free">Free</option>
              <option value="plus">Plus</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Опис</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Тренер</label>
          <select
            name="trainerId"
            value={form.trainerId || ""}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">— Оберіть тренера —</option>
            {trainers.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.firstName} {tr.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Обкладинка</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
          {preview && (
            <div className="mt-3 h-32 w-full overflow-hidden rounded-md border border-black/10 bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-primary/80 disabled:opacity-60"
        >
          {loading ? "Зберігаємо..." : editingId ? "Оновити тренування" : "Додати тренування"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Усі тренування</h2>
        {trainings.length === 0 ? (
          <p className="text-sm text-slate-600">Поки немає тренувань.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl bg-white shadow px-4 py-3 space-y-2 border border-black/5"
              >
                <div className="h-32 w-full overflow-hidden rounded-xl bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image || "/img/hero-gym.jpg"}
                    alt={t.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="text-xs text-slate-600">
                  {t.category} · {t.level} · {t.durationMin} хв
                </div>
                {t.startAt && (
                  <div className="text-xs text-slate-600">
                    {new Date(t.startAt).toLocaleString("uk-UA")}
                  </div>
                )}
                {t.minSubscription && (
                  <div className="text-xs text-slate-600">
                    Мін. абонемент: {t.minSubscription}
                  </div>
                )}
                {t.coach && <div className="text-xs text-slate-600">Тренер: {t.coach}</div>}
                {t.description && (
                  <p className="text-xs text-slate-700 line-clamp-3">{t.description}</p>
                )}
                <div className="flex gap-2 pt-1 text-xs">
                  <button
                    onClick={() => handleEdit(t)}
                    className="rounded-full border px-3 py-1 hover:bg-black/5"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="rounded-full border px-3 py-1 text-red-600 hover:bg-red-50"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
