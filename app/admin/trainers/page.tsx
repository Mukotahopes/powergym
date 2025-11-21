"use client";

import { useEffect, useState } from "react";

type Trainer = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

const emptyForm = { firstName: "", lastName: "", avatar: "" };

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/trainers");
      const data = await res.json();
      setTrainers(
        data.map((t: any) => ({
          id: String(t._id ?? t.id),
          firstName: t.firstName,
          lastName: t.lastName,
          avatar: t.avatar,
        }))
      );
    } catch (e) {
      console.error("Failed to load trainers", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Ім'я та прізвище обов'язкові");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/trainers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/trainers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      }
      await load();
      setForm(emptyForm);
      setEditingId(null);
    } catch (e) {
      console.error(e);
      setError("Не вдалося зберегти тренера");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tr: Trainer) => {
    setEditingId(tr.id);
    setForm({
      firstName: tr.firstName,
      lastName: tr.lastName,
      avatar: tr.avatar || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити тренера?")) return;
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTrainers((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      alert("Не вдалося видалити");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold">Адмін · Тренери</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl bg-white p-5 shadow border border-black/10"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingId ? "Редагувати тренера" : "Новий тренер"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="text-xs text-slate-600 underline"
            >
              Скасувати
            </button>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">Ім'я</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Прізвище</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Avatar URL (опційно)</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.avatar}
              onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black hover:bg-primary/80 disabled:opacity-60"
        >
          {saving ? "Зберігаємо..." : editingId ? "Оновити тренера" : "Створити тренера"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Усі тренери</h2>
        {trainers.length === 0 ? (
          <p className="text-sm text-slate-600">Тренерів ще немає.</p>
        ) : (
          trainers.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-white shadow px-4 py-3 text-sm border border-black/5"
            >
              <div>
                <p className="font-semibold">
                  {t.firstName} {t.lastName}
                </p>
                {t.avatar && (
                  <p className="text-xs text-slate-500 break-all">Avatar: {t.avatar}</p>
                )}
              </div>
              <div className="flex gap-2 text-xs">
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
          ))
        )}
      </div>
    </div>
  );
}
