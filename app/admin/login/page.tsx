"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Невірний логін або пароль");
        return;
      }

      if (data.role !== "admin") {
        setError("Цей акаунт не має прав адміністратора");
        return;
      }

      localStorage.setItem("powergymUser", JSON.stringify(data));
      router.push("/admin/news");
    } catch (err) {
      console.error(err);
      setError("Сталася помилка, спробуйте ще раз");
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
            Вхід в адмін-кабінет
          </h1>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="admin@example.com"
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
              placeholder="••••••••"
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
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/80"
          >
            Увійти як адмін
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
