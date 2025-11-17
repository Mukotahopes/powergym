import Image from "next/image";
import Navbar from "@/components/Navbar";
import BenefitCard from "@/components/BenefitCard";
import NewsCard from "@/components/NewsCard";
import NewsSection, { NewsItem } from "@/components/NewsSection";
import Footer from "@/components/Footer";




async function getNews(): Promise<NewsItem[]> {
  const res = await fetch("http://localhost:3000/api/news", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
export default async function HomePage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-[#f2f5f7] text-black flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Зміни себе разом
            <br /> з <span className="text-primary">PowerGYM</span>
          </h1>
          <p className="max-w-md text-sm text-black/70 md:text-base">
            Тренування, мотивація та результат — все в одному місці.
          </p>
          <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-primary/80">
            Записатись
          </button>
        </div>

        <div className="relative flex-1 h-64 md:h-80">
          <Image
            src="/img/hero-gym.jpg"
            alt="PowerGym training"
            fill
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      </section>

      {/* НАШІ ПЕРЕВАГИ */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-4">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-wide">
          НАШІ ПЕРЕВАГИ
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <BenefitCard
            icon={<span>🏋️‍♂️</span>}
            title="Сучасне обладнання"
            description="Професійні тренажери нового покоління, що відповідають міжнародним стандартам."
          />
          <BenefitCard
            icon={<span>🤖</span>}
            title="AI-Тренер"
            description="Штучний інтелект створює персональну програму тренувань під твій ритм життя."
          />
          <BenefitCard
            icon={<span>🏆</span>}
            title="Система досягнень"
            description="Збирай бали, підвищуй рейтинг і обмінюй їх на бонуси та знижки."
          />
        </div>
      </section>

      {/* НОВИНИ ТА АКЦІЇ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* НОВИНИ ТА АКЦІЇ */}
<NewsSection items={news} />

      </section>

      <Footer />
    </main>
  );
}
