"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const links = [
  { href: "/admin/trainings", label: "Trainings" },
  { href: "/admin/trainers", label: "Trainers" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/personal-trainings", label: "Personal trainings" },
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

    const stored = localStorage.getItem("powergymUser");
    let isAdmin = false;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        isAdmin = parsed?.role === "admin";
      } catch (err) {
        console.error("Cannot parse powergymUser:", err);
      }
    }

    if (pathname === "/admin/login") {
      if (isAdmin) {
        router.replace("/admin/news");
      }
      return;
    }

    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen flex bg-[#F4F7F6] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-lg font-extrabold">PowerGYM Admin</div>
          <div className="text-[11px] text-white/60 mt-1">
            Manage content and club members
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-[#8DD9BE] text-black font-semibold"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/50">
          © {new Date().getFullYear()} PowerGYM
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
