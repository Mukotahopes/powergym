"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/contacts", label: "Контакти" },
  { href: "/trainings", label: "Тренування" },
  { href: "/ai-trainer", label: "AI-тренер" },
  { href: "/schedule", label: "Розклад" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-black text-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-primary">Power</span>GYM
        </Link>

        <div className="hidden gap-6 text-sm md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active ? "text-primary" : "text-white/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Link
            href="/login"
            className="rounded-full border border-white/30 px-4 py-1 text-sm hover:border-primary hover:text-primary transition-colors"
          >
            Увійти
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-black hover:bg-primary/80 transition-colors"
          >
            Реєстрація
          </Link>
        </div>
      </nav>
    </header>
  );
}
