"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact-messages")
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((list: any[]) => {
        const mapped: ContactMessage[] = list.map((m) => ({
          id: String(m._id ?? m.id),
          name: m.name,
          email: m.email,
          message: m.message,
          createdAt: m.createdAt,
        }));
        setMessages(mapped);
      })
      .catch((e) => console.error("Error fetching messages:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-extrabold mb-4">Повідомлення</h1>

      {loading ? (
        <p className="text-sm text-slate-600">Завантаження повідомлень...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-slate-600">
          Повідомлень від клієнтів поки немає.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] px-5 py-4 text-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold">
                  {m.name}{" "}
                  <span className="text-xs text-slate-500">({m.email})</span>
                </div>
                {m.createdAt && (
                  <div className="text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-800 whitespace-pre-wrap">
                {m.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
