import Image from "next/image";
import Navbar from "@/components/Navbar";
import BenefitCard from "@/components/BenefitCard";
import NewsCard from "@/components/NewsCard";
import NewsSection, { NewsItem } from "@/components/NewsSection";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";

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
      <Hero/>
  

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
