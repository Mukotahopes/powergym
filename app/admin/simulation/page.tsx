"use client";

import { useEffect, useState } from "react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  points?: number;
};

export default function AdminSimulationPage() {
  const [gymCount, setGymCount] = useState<number>(0);
  const [gymMsg, setGymMsg] = useState<string | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [pointsDate, setPointsDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [pointsMsg, setPointsMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gym-load")
      .then((res) => (res.ok ? res.json() : { count: 0 }))
      .then((data) => setGymCount(data.count ?? 0))
      .catch(() => setGymCount(0));

    fetch("/api/users")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: any[]) => {
        setUsers(
          list.map((u) => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            points: u.points,
          }))
        );
      })
      .catch(() => setUsers([]));
  }, []);

  const handleGymSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGymMsg(null);
    const res = await fetch("/api/gym-load", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: gymCount }),
    });
    setGymMsg(res.ok ? "Оновлено" : "Помилка оновлення");
  };

  const handlePointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPointsMsg(null);
    if (!selectedUser) {
      setPointsMsg("Оберіть користувача");
      return;
    }
    const res = await fetch(`/api/users/${selectedUser}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pointsToAdd, date: pointsDate }),
    });
    setPointsMsg(res.ok ? "Бали нараховано" : "Помилка нарахування");
    if (res.ok) setPointsToAdd(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold">Симуляція</h1>

      <section className="rounded-3xl bg-white p-5 shadow border border-black/5">
        <h2 className="text-xl font-semibold mb-3">Завантаження залу</h2>
        <form onSubmit={handleGymSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Кількість людей</label>
            <input
              type="number"
              value={gymCount}
              onChange={(e) => setGymCount(Number(e.target.value) || 0)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black hover:bg-primary/80"
          >
            Оновити
          </button>
          {gymMsg && <p className="text-xs text-slate-600">{gymMsg}</p>}
        </form>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow border border-black/5">
        <h2 className="text-xl font-semibold mb-3">Нарахувати бали</h2>
        <form onSubmit={handlePointsSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Користувач</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">— Оберіть користувача —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Скільки балів додати</label>
              <input
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(Number(e.target.value) || 0)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Дата зарахування</label>
              <input
                type="date"
                value={pointsDate}
                onChange={(e) => setPointsDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black hover:bg-primary/80"
          >
            Нарахувати
          </button>
          {pointsMsg && <p className="text-xs text-slate-600">{pointsMsg}</p>}
        </form>
      </section>
    </div>
  );
}
