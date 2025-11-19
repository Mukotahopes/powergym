import Image from "next/image";

export type TrainingItem = {
  _id?: string;
  title: string;
  category: string;
  level?: string;
  durationMin?: number;
  description?: string;
  coach?: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
};

const categoryLabels: Record<string, string> = {
  cardio: "Кардіо",
  functional: "Функціональні",
  strength: "Силові",
};

const levelLabels: Record<string, string> = {
  beginner: "Початковий рівень",
  intermediate: "Середній рівень",
  advanced: "Просунутий рівень",
};

type Props = {
  training: TrainingItem;
};

export default function TrainingCard({ training }: Props) {
  const {
    title,
    category,
    level,
    durationMin,
    coach,
    rating,
    reviewsCount,
    image,
  } = training;

  const categoryLabel = categoryLabels[category] ?? "Тренування";
  const levelLabel = level ? levelLabels[level] ?? level : undefined;
  const ratingValue = typeof rating === "number" && rating > 0 ? rating : 4.9;

  return (
    <article className="flex w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.15)]">
      {/* Верхня частина з картинкою */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image || "/img/hero-gym.jpg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 320px"
        />

        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1 text-xs font-medium text-white">
          {categoryLabel}
        </div>
      </div>

      {/* Нижня частина */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {levelLabel && <span>{levelLabel} • </span>}
            {durationMin ? `${durationMin} хв` : "45 хв"}
          </p>
        </div>

        {training.description && (
          <p className="text-sm text-slate-700 line-clamp-3">
            {training.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {coach || "Тренер залу PowerGYM"}
            </span>
            <span className="text-xs text-slate-500">
              ⭐ {ratingValue.toFixed(1)}{" "}
              {typeof reviewsCount === "number" &&
                reviewsCount > 0 &&
                `(${reviewsCount} відгуків)`}
            </span>
          </div>

          <button className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#8DD9BE] hover:text-black">
            Записатись
          </button>
        </div>
      </div>
    </article>
  );
}
