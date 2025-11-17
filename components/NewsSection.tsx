"use client";

import { useState } from "react";
import NewsCard from "./NewsCard";

export type NewsItem = {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  image?: string;
  publishedAt?: string;
};

type Props = {
  items: NewsItem[];
};

export default function NewsSection({ items }: Props) {
  const [selected, setSelected] = useState<NewsItem | null>(null);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-wide">
          НОВИНИ та АКЦІЇ
        </h2>

        {items.length === 0 ? (
          <p className="text-center text-sm text-black/60">
            Поки що немає новин. Додай першу в розділі <strong>/admin/news</strong>.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {items.slice(0, 3).map((item) => (
              <NewsCard
                key={item._id}
                title={item.title}
                shortDescription={item.shortDescription || item.fullDescription || ""}
                image={item.image}
                publishedAt={item.publishedAt}
                onDetails={() => setSelected(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* МОДАЛЬНЕ ВІКНО */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-4">
              <h3 className="text-lg font-bold">{selected.title}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-black/60 hover:text-black"
              >
                ✕
              </button>
            </div>

            {selected.image && (
              <div className="mt-3 h-48 w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-black/80 whitespace-pre-line">
              {selected.fullDescription || selected.shortDescription}
            </p>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-black/20 px-4 py-1 text-xs font-semibold text-black hover:bg-black/5"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
