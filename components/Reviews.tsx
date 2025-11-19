// components/Reviews.tsx
import Image from "next/image";

type Review = {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  locked?: boolean;
};

const reviews: Review[] = [
  {
    id: 1,
    user: "Катерина Бондаренко",
    avatar: "/img/users/user1.jpg",
    rating: 5,
    text: `"Найкращий тренер, який у мене був. Усе професійно та з індивідуальним підходом. Дуже рекомендую!"`,
  },
  {
    id: 2,
    user: "Прихований відгук",
    avatar: "/img/users/default.jpg",
    rating: 0,
    text: "Увійдіть, щоб побачити більше відгуків та залишити свій",
    locked: true,
  },
  {
    id: 3,
    user: "Прихований відгук",
    avatar: "/img/users/default.jpg",
    rating: 0,
    text: "Увійдіть, щоб побачити більше відгуків та залишити свій",
    locked: true,
  },
];

export function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-10 text-center text-2xl font-extrabold">
        Останні відгуки користувачів
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`rounded-2xl p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
              review.locked ? "bg-[#E3EFEA]/70 blur-[1px] relative" : "bg-[#E3EFEA]"
            }`}
            style={{ height: "180px" }}
          >
            {/* якщо locked — іконка замка */}
            {review.locked && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-white p-3 shadow">
                    🔒
                  </div>
                  <p className="text-sm font-medium max-w-[200px]">
                    Увійдіть, щоб побачити більше відгуків
                  </p>
                </div>
              </div>
            )}

            <div className={`${review.locked ? "opacity-0" : "opacity-100"} flex gap-4`}>
              <Image
                src={review.avatar}
                alt={review.user}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />

              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold">{review.user}</h3>

                <div className="flex gap-1 mb-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>

                <p className="text-sm text-slate-700">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
