"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (login === "admin" && password === "admin") {
      // простий варіант для адмін-доступу
      localStorage.setItem("powergymAdmin", "true");
      router.push("/admin/news");
    } else {
      setError("Невірний логін або пароль");
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.15)] space-y-4"
      >
        <h1 className="text-2xl font-extrabold text-center mb-2">
          Вхід в адмін-кабінет
        </h1>

        <div>
          <label className="block text-sm font-medium mb-1">Логін</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="admin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="admin"
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
  );
}
