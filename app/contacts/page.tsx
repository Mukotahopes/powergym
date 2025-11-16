import Navbar from "@/components/Navbar";

type NewsItem = {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
};

async function getNews(): Promise<NewsItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/news`, {
    // у dev можна no-store; у проді додамо revalidate
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export default async function HomePage() {
  const news = await getNews();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">Перевірка Tailwind 💚</h1>
        <p>Якщо цей блок кольоровий — Tailwind працює.</p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-4">Останні новини</h2>
        <ul className="grid gap-4">
          {news.map(n => (
            <li key={n._id} className="rounded-xl border p-4 bg-light">
              <h3 className="text-lg font-semibold">{n.title}</h3>
              <p className="text-sm opacity-80">{n.description}</p>
            </li>
          ))}
          {news.length === 0 && (
            <li className="opacity-70">Новин поки немає. Додай першу через POST /api/news.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
