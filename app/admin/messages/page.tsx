"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
};

type UserItem = {
  id: string;
  name?: string;
  email: string;
  role: string;
  subscription?: string;
  subscriptionUntil?: string | null;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contact-messages")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: any[]) => {
        setMessages(
          list.map((m) => ({
            id: String(m._id ?? m.id),
            name: m.name,
            email: m.email,
            message: m.message,
            createdAt: m.createdAt,
            isRead: m.isRead,
          }))
        );
      })
      .catch((e) => console.error("Error fetching messages:", e))
      .finally(() => setLoadingMessages(false));
  }, []);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: any[]) => {
        setUsers(
          list.map((u) => ({
            id: u.id ?? u._id,
            name: u.name,
            email: u.email,
            role: u.role ?? "user",
            subscription: u.subscription ?? "free",
            subscriptionUntil: u.subscriptionUntil ?? null,
          }))
        );
      })
      .catch((e) => console.error("Error fetching users:", e))
      .finally(() => setLoadingUsers(false));
  }, []);

  const updateMessage = (id: string, updater: (m: ContactMessage) => ContactMessage | null) => {
    setMessages((prev) =>
      prev
        .map((m) => (m.id === id ? updater(m) : m))
        .filter((m): m is ContactMessage => m !== null)
    );
  };

  async function handleMarkRead(id: string, nextRead: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextRead }),
      });
      if (!res.ok) {
        throw new Error("Failed to update");
      }
      updateMessage(id, (m) => ({ ...m, isRead: nextRead }));
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId((prev) => (prev === id ? null : prev));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact-messages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      updateMessage(id, () => null);
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId((prev) => (prev === id ? null : prev));
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Видалити користувача?")) return;
    setBusyUserId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setBusyUserId((prev) => (prev === id ? null : prev));
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Contact messages</h1>
        {loadingMessages ? (
          <p className="text-sm text-slate-600">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-600">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <article
                key={m.id}
                className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] px-5 py-4 text-sm"
              >
                <div className="flex justify-between items-center mb-2 gap-3">
                  <div>
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
                  <div className="text-[11px] text-slate-500">
                    {m.isRead ? "Read" : "Unread"}
                  </div>
                </div>

                <p className="text-xs text-slate-800 whitespace-pre-wrap mb-3">{m.message}</p>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => handleMarkRead(m.id, !m.isRead)}
                    disabled={busyId === m.id}
                    className="rounded-full border px-3 py-1 hover:bg-black/5 disabled:opacity-60"
                  >
                    {m.isRead ? "Mark as unread" : "Mark as read"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={busyId === m.id}
                    className="rounded-full border px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-extrabold mb-3">Users</h2>
        {loadingUsers ? (
          <p className="text-sm text-slate-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-600">No users found.</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-xl bg-white shadow px-4 py-3 text-sm flex justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">{u.name || "No name"}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                  <p className="text-xs text-slate-600">
                    Role: {u.role} · Subscription: {u.subscription}
                    {u.subscriptionUntil
                      ? ` (until ${new Date(u.subscriptionUntil).toLocaleDateString("uk-UA")})`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 self-start">ID: {u.id}</span>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    disabled={busyUserId === u.id}
                    className="rounded-full border px-3 py-1 text-[11px] text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
