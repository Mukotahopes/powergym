// src/components/Hero.tsx
import Image from "next/image";

export function Hero() {
  return (
    <section >
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-20 md:flex-row md:items-center md:justify-between">
        
        {/* ЛІВА ЧАСТИНА */}
        <div className="max-w-lg space-y-6 md:w-1/2">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Зміноюй себе разом <br /> з{" "}
            <span className="text-[#8DD9BE]">PowerGYM</span>
          </h1>

          <p className="text-gray-700 text-base md:text-lg">
            Тренування, мотивація та результат – все в одному місці
          </p>

          <button className="rounded-full bg-[#8DD9BE] px-6 py-3 text-sm font-semibold text-black shadow-md hover:bg-[#7ACDAE] transition">
            Записатись
          </button>
        </div>

        {/* ПРАВА ЧАСТИНА — ВЕЛИКА КАРТИНКА */}
        <div className="relative mt-10 h-[380px] w-full overflow-hidden rounded-xl shadow-xl md:mt-0 md:h-[480px] md:w-1/2">
          <Image
            src="/img/hero-gym.jpg"
            alt="PowerGym training"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
}
