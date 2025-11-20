"use client";

import { useEffect, useMemo, useState } from "react";

type Client = {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  subscription?: string;
  subscriptionUntil?: string | null;
  createdAt?: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(() => {
      const query = search.trim();
      const url = query
        ? `/api/admin/clients?q=${encodeURIComponent(query)}`
        : "/api/admin/clients";

      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setClients(data))
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Не вдалося завантажити клієнтів", error);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  const subtitle = useMemo(() => {
    if (loading) return "Завантаження списку...";
    if (clients.length === 0) return "Клієнтів не знайдено";
    return `Знайдено ${clients.length} клієнтів`;
  }, [clients.length, loading]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold">Клієнти</h1>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        <input
          className="w-full md:w-80 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          placeholder="Пошук за імʼям або email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
        <div className="grid grid-cols-3 md:grid-cols-6 px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          <div>Імʼя</div>
          <div>Email</div>
          <div className="hidden md:block">Роль</div>
          <div className="hidden md:block">Тариф</div>
          <div className="hidden md:block">До</div>
          <div className="text-right">Реєстрація</div>
        </div>
        <div className="divide-y divide-slate-100">
          {clients.map((client) => (
            <div
              key={client._id}
              className="grid grid-cols-3 md:grid-cols-6 px-4 py-3 text-sm items-center"
            >
              <div className="truncate pr-2">{client.name || "—"}</div>
              <div className="truncate pr-2 text-slate-700">{client.email}</div>
              <div className="hidden md:block text-xs uppercase text-slate-600">
                {client.role || "user"}
              </div>
              <div className="hidden md:block text-xs uppercase text-slate-600">
                {client.subscription || "free"}
              </div>
              <div className="hidden md:block text-xs text-slate-600">
                {client.subscriptionUntil
                  ? new Date(client.subscriptionUntil).toLocaleDateString("uk-UA")
                  : "—"}
              </div>
              <div className="text-right text-xs text-slate-500">
                {client.createdAt
                  ? new Date(client.createdAt).toLocaleDateString("uk-UA")
                  : "—"}
              </div>
            </div>
          ))}
          {!loading && clients.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-600 text-center">
              Немає клієнтів за обраним запитом.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
