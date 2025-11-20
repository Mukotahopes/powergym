"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

const avatarPool = [
  "/img/avatars/avatar1.png",
  "/img/avatars/avatar2.png",
  "/img/avatars/avatar3.png",
  "/img/avatars/avatar4.png",
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    avatarPool[0] // дефолтна вибрана
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          avatar: selectedAvatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Помилка реєстрації");
        return;
      }

      localStorage.setItem("powergymUser", JSON.stringify(data));

      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-light text-dark flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.15)] space-y-4"
        >
          <h1 className="text-2xl font-extrabold text-center mb-2">
            Реєстрація
          </h1>

          <div>
            <label className="block text-sm font-medium mb-1">Імʼя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Ваше імʼя"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
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
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Мінімум 6 символів"
              required
            />
          </div>

          {/* Вибір аватарки */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Обери аватар
            </label>
            <div className="grid grid-cols-4 gap-3">
              {avatarPool.map((src) => {
                const isActive = selectedAvatar === src;
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setSelectedAvatar(src)}
                    className={`relative h-16 w-16 overflow-hidden rounded-full border-2 transition ${
                      isActive
                        ? "border-primary shadow-lg"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Ти зможеш змінити аватар у профілі пізніше.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/80 disabled:opacity-60"
          >
            {loading ? "Реєструю..." : "Зареєструватися"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
