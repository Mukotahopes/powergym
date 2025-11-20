"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // простий захист: тільки якщо admin у localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAdmin = localStorage.getItem("powergymAdmin") === "true";
    if (!isAdmin) {
      router.replace("/admin/login");
      return;
    }

    async function fetchMessages() {
      try {
        const res = await fetch("/api/contact-messages");
        const data = await res.json();
        setMessages(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [router]);

  const markAsRead = async (id: string, newValue: boolean) => {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newValue }),
      });

      if (!res.ok) return;

      const updated = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">
        Адмін · Повідомлення з контакті
      </h1>

      {loading && <p>Завантаження...</p>}

      {!loading && messages.length === 0 && (
        <p className="text-sm text-slate-600">
          Поки що немає жодного повідомлення.
        </p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`rounded-2xl border px-4 py-3 shadow-sm bg-white ${
              !msg.isRead ? "border-primary" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">
                  {msg.name}{" "}
                  <span className="text-xs text-slate-500">
                    · {new Date(msg.createdAt).toLocaleString("uk-UA")}
                  </span>
                </p>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs text-primary hover:underline"
                >
                  {msg.email}
                </a>
              </div>

              <button
                onClick={() => markAsRead(msg._id, !msg.isRead)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  msg.isRead
                    ? "bg-slate-100 text-slate-700"
                    : "bg-primary text-black"
                }`}
              >
                {msg.isRead ? "Прочитано" : "Позначити як прочитане"}
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-800 whitespace-pre-line">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
