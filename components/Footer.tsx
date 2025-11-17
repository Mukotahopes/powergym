import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-xl font-extrabold">
            <span className="text-primary">Power</span>GYM
          </div>
          <p className="text-xs text-white/60">Train. Evolve. Repeat.</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Навігація</span>
          <Link href="/" className="text-white/70 hover:text-primary">
            Головна
          </Link>
          <Link href="/trainings" className="text-white/70 hover:text-primary">
            Тренування
          </Link>
          <Link href="/ai-trainer" className="text-white/70 hover:text-primary">
            AI-тренер
          </Link>
          <Link href="/schedule" className="text-white/70 hover:text-primary">
            Розклад
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Контакти</span>
          <p className="text-white/70">м. Рівне, вул. Прикладна, 1</p>
          <p className="text-white/70">+380 (97) 777-77-77</p>
          <p className="text-white/70">powergym@example.com</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-xs text-white/50">
        © {new Date().getFullYear()} PowerGYM. Всі права захищені.
      </div>
    </footer>
  );
}
