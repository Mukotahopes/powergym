"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/contacts", label: "Контакти" },
  { href: "/trainings", label: "Тренування" },
  { href: "/ai-trainer", label: "AI-тренер" },
  { href: "/schedule", label: "Розклад" },
];

type AppUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string; // на майбутнє, якщо додаси
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);

  // зчитуємо користувача з localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("powergymUser");
      if (stored) {
        const parsed = JSON.parse(stored) as AppUser;
        setUser(parsed);
      }
    } catch (e) {
      console.error("Cannot parse powergymUser", e);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("powergymUser");
    }
    setUser(null);
    router.push("/");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `text-sm md:text-[15px] font-medium transition-colors ${
      isActive(href)
        ? "text-primary"
        : "text-white hover:text-primary"
    }`;

  const avatarSrc = user?.avatar || "/img/default-avatar.png"; // заміни шлях на свій, якщо треба
  const userName = user?.name || user?.email || "Мій профіль";

  return (
    <header className="bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Логотип */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-primary"
        >
          PowerGYM
        </Link>

        {/* Навігація + акаунт */}
        <div className="flex items-center gap-6">
          {/* Лінки */}
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Правий блок: або логін/реєстрація, або профіль + вихід */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Профіль */}
              <button
                onClick={goToProfile}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 pr-3 text-xs md:text-sm hover:bg-white/10 transition"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-slate-700">
                  <Image
                    src={avatarSrc}
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="max-w-[90px] truncate md:max-w-[120px]">
                  {userName}
                </span>
              </button>

              {/* Вихід */}
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black text-lg font-bold shadow-md hover:bg-primary/80 transition"
                title="Вийти"
              >
                ⤴
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-1 text-sm font-semibold text-white hover:text-primary transition-colors"
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-black shadow-md hover:bg-primary/80 transition-colors"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
