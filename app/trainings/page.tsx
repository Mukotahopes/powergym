import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingCard from "@/components/TrainingCard";
import { Reviews } from "@/components/Reviews";

// поки без суворих типів, щоб не сварився TS, бо структура тренування
// може мінятися (trainer, rating тощо)
type Training = any;

async function getTrainings(): Promise<Training[]> {
  // так само, як у тебе зроблено для новин
  const res = await fetch("http://localhost:3000/api/trainings", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function TrainingsPage() {
  const trainings = await getTrainings();

  const categories = [
    { id: "cardio", label: "Кардіо", icon: "❤️" },
    { id: "functional", label: "Функціональні", icon: "💪" },
    { id: "strength", label: "Силові", icon: "🏋️‍♂️" },
  ];

  return (
    <main className="min-h-screen bg-[#f2f5f7] text-black flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* КОНТЕНТ СТОРІНКИ */}
      <div className="flex-1">
        {/* Заголовок + опис */}
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide md:text-4xl">
            Тренування
          </h1>
          <p className="mt-3 text-sm text-slate-700 md:text-base max-w-2xl mx-auto">
            У нашому спортзалі представлені різноманітні види тренувань:
            силові, кардіо, функціональні. Кожне тренування веде досвідчений
            сертифікований тренер.
          </p>
        </section>

        {/* Фільтри категорій (поки що тільки UI) */}
        <section className="mx-auto mb-8 flex max-w-6xl flex-wrap justify-center gap-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-800 shadow-md transition hover:bg-[#8DD9BE] hover:text-black"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </section>

        {/* Сітка тренувань */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trainings.length === 0 && (
              <p className="col-span-full text-center text-sm text-slate-600">
                Поки що немає жодного тренування.
              </p>
            )}

            {trainings.map((training) => (
              <TrainingCard key={training._id} training={training} />
            ))}
          </div>
        </section>

        {/* ОСТАННІ ВІДГУКИ */}
        <Reviews />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
