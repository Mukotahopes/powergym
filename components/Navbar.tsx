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
  avatar?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("powergymUser");
      if (stored) setUser(JSON.parse(stored) as AppUser);
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
    setIsOpen(false);
  };

  const goToProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      isActive(href) ? "text-primary" : "text-white hover:text-primary"
    }`;

  const avatarSrc = user?.avatar || "/img/default-avatar.png";
  const userName = user?.name || user?.email || "Користувач";

  return (
    <header className="bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-primary">
          PowerGYM
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={goToProfile}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 pr-3 text-xs md:text-sm hover:bg-white/10 transition"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-slate-700">
                  <Image src={avatarSrc} alt={userName} fill className="object-cover" />
                </div>
                <span className="max-w-[120px] truncate">{userName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black text-lg font-bold shadow-md hover:bg-primary/80 transition"
                title="Вийти"
              >
                ↻
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

        {/* Mobile controls */}
        <button
          type="button"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
          onClick={() => setIsOpen((p) => !p)}
          aria-label="Перемикач меню"
        >
          <span className="text-xl">☰</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 pb-4">
          <ul className="flex flex-col gap-3 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <button
                onClick={goToProfile}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-slate-700">
                  <Image src={avatarSrc} alt={userName} fill className="object-cover" />
                </div>
                <span className="max-w-[140px] truncate">{userName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black text-lg font-bold shadow-md hover:bg-primary/80 transition"
              >
                ↻
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-t border-white/10 pt-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:text-primary transition-colors"
              >
                Увійти
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-primary/80 transition-colors"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
