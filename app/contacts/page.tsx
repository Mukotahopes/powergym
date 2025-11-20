"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ContactsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
  
    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
  
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
  
      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Не вдалося надіслати повідомлення");
        console.error("Contact API error:", text);
        return;
      }
  
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Сталася помилка. Спробуйте ще раз.");
    }
  }
  
  const isSending = status === "sending";

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <h1 className="text-center text-3xl font-extrabold md:text-4xl">
            Контакти
          </h1>
          <p className="mt-2 text-center text-sm text-slate-700 md:text-base">
            Зв’яжіться з нами, і ми з радістю відповімо на ваші запитання!
          </p>

          {/* Верхній блок: інформація + карта */}
          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
            {/* Контактна інформація */}
            <div className="rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-sm space-y-2">
              <p>📞 Телефон: +380 67 123 45 67</p>
              <p>✉️ Email: info@gym.ua</p>
              <p>📍 Адреса: м. Рівне, вул. Соборна, 17</p>
              <p>⏰ Години роботи: Пн–Сб: 8:00–22:00, Нд: 8-21:00</p>
            </div>

            {/* Карта + кнопка "Відкрити" */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                {/* Можеш замінити на свій скрін мапи */}
                <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
  <iframe
    title="PowerGYM на мапі"
    src="https://www.google.com/maps?q=м.+Рівне,+вул.+Соборна,+17 &output=embed"
    style={{ border: 0 }}
    className="h-full w-full"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>

              </div>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-black shadow-md hover:bg-primary/80"
              >
                Відкрити
              </a>
            </div>
          </div>

          {/* Форма */}
          <div className="mt-12 flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Імʼя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Ваше імʼя"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Повідомлення
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Ваше запитання або коментар"
                  required
                />
              </div>

              {status === "success" && (
                <p className="text-xs rounded-lg bg-green-50 px-3 py-2 text-green-700">
                  Повідомлення надіслано! Ми звʼяжемося з вами якнайшвидше.
                </p>
              )}

              {status === "error" && error && (
                <p className="text-xs rounded-lg bg-red-50 px-3 py-2 text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-primary/80 disabled:opacity-60"
              >
                {isSending ? "Надсилаємо..." : "Надіслати"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
