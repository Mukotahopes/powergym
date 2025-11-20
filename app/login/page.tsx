"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Помилка входу");
        return;
      }

      localStorage.setItem("powergymUser", JSON.stringify(data));

      if (data.role === "admin") {
        router.push("/admin");       // адмін в адмінку
      } else {
        router.push("/profile");     // звичайний користувач в профіль
      }
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
            Вхід
          </h1>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
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
              required
            />
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
            {loading ? "Входжу..." : "Увійти"}
          </button>

          <p className="text-xs text-center text-slate-600">
            Немає акаунту?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-primary underline"
            >
              Зареєструватися
            </button>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}
