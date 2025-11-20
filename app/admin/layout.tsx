"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const links = [
  { href: "/admin/trainings", label: "Тренування" },
  { href: "/admin/trainers", label: "Тренери" },
  { href: "/admin/news", label: "Новини" },
  { href: "/admin/messages", label: "Повідомлення" },
  { href: "/admin/clients", label: "Клієнти" },
  { href: "/admin/personal-trainings", label: "Персональні тренування" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isLoginPage = pathname === "/admin/login";
    const hasAdminAccess = localStorage.getItem("powergymAdmin") === "true";

    if (isLoginPage && hasAdminAccess) {
      router.replace("/admin/news");
      return;
    }

    if (!isLoginPage && !hasAdminAccess) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center px-4 py-12">
        <main className="w-full max-w-2xl">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F7F6] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-lg font-extrabold">PowerGYM Admin</div>
          <div className="text-[11px] text-white/60 mt-1">
            Панель керування залом
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "block rounded-full px-4 py-2 text-sm transition bg-[#8DD9BE] text-black font-semibold"
                    : "block rounded-full px-4 py-2 text-sm transition text-white/80 hover:bg-white/10"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
