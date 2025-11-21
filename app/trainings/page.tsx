import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reviews } from "@/components/Reviews";
import TrainingListClient from "./TrainingListClient";

type Training = {
  _id: string;
  title: string;
  category: "cardio" | "functional" | "strength";
  level: string;
  durationMin: number;
  description?: string;
  image?: string;
  coach?: string;
  trainer?: { firstName?: string; lastName?: string };
  startAt?: string;
  minSubscription?: "free" | "plus" | "premium";
};

async function getTrainings(): Promise<Training[]> {
  const res = await fetch("http://localhost:3000/api/trainings", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function TrainingsPage() {
  const trainings = await getTrainings();

  return (
    <main className="min-h-screen bg-[#f2f5f7] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide md:text-4xl">
            Тренування
          </h1>
          <p className="mt-3 text-sm text-slate-700 md:text-base max-w-2xl mx-auto">
            Обирайте формат, рівень та тренера, записуйтесь на тренування й слідкуйте за прогресом.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <TrainingListClient trainings={trainings} />
        </section>

        <Reviews />
      </div>

      <Footer />
    </main>
  );
}
