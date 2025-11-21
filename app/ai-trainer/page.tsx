"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type AppUser = {
  id?: string;
  name?: string;
  subscription?: "free" | "plus" | "premium";
};

type FormState = {
  age: string;
  sex: string;
  goal: string;
  level: string;
  frequency: string;
  weight: string;
};

const buildPlan = (f: FormState) => {
  const levelText = f.level || "середній";
  const freq = f.frequency || "3-4 рази на тиждень";
  const goal = f.goal || "загальна форма";
  const weight = f.weight || "—";
  const warmup = "- Розминка 5-10 хв (легке кардіо + мобільність)";
  const cooldown = "- Заминка 5-10 хв (розтяжка, дихання)";

  const workouts = [
    {
      name: "День 1: Ноги + кор",
      list: [
        "Присідання з власною вагою/штангою – 4×12",
        "Випади вперед – 3×10/нога",
        "Румунська тяга гантелі/штанга – 3×12",
        "Планка – 3×40-60 сек",
        "Скручування на прес – 3×15-20",
      ],
    },
    {
      name: "День 2: Спина + біцепс",
      list: [
        "Тяга гантелі/Штанги в нахилі – 4×10-12",
        "Підтягування/Тяга верхнього блоку – 4×8-12",
        "Гіперекстензії – 3×12-15",
        "Підйом гантелей на біцепс – 3×12-15",
        "Молитва/ізольована згинання – 3×12",
      ],
    },
    {
      name: "День 3: Груди + плечі + трицепс",
      list: [
        "Жим гантелей/штанги лежачи – 4×8-12",
        "Віджимання – 3×макс",
        "Розведення гантелей лежачи – 3×12-15",
        "Жим гантелей сидячи – 3×10-12",
        "Французький жим/Тяга канату на трицепс – 3×12-15",
      ],
    },
    {
      name: "День 4: Функціонал + кор",
      list: [
        "Берпі – 3×12-15",
        "Гірка/альпініст – 3×30 сек",
        "Сайд-планка – 3×30 сек/бік",
        "Русійські скручування – 3×20",
        "Велосипед на прес – 3×20",
      ],
    },
  ];

  const text = [
    `План на 4 тижні під твій рівень (${levelText}), мету (${goal}), вага ${weight} кг, частота: ${freq}.`,
    "",
    "Щотижнева прогресія:",
    "- Додавай +2-5% ваги або +1 повтор там, де можливо.",
    "- Зберігай техніку, відпочинок між підходами 60-90 сек (силові 120 сек).",
    "",
    "Тренування:",
    warmup,
    "...",
  ];

  workouts.forEach((w) => {
    text.push(w.name);
    text.push(...w.list.map((l) => `- ${l}`));
    text.push(cooldown, "...");
  });

  text.push(
    "",
    "Кардіо/NEAT:",
    "- Піші прогулянки 20-40 хв у дні відпочинку.",
    "- Легке кардіо 1-2 рази на тиждень (біг/велотренажер 20-30 хв).",
    "",
    "Безпека:",
    "- Якщо відчуваєш біль у суглобах/спині — зменш інтенсивність або заміни вправу.",
    "- Розминка/заминка обов’язково кожного тренування."
  );

  return text.join("\n");
};

export default function AiTrainerPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState<FormState>({
    age: "",
    sex: "",
    goal: "",
    level: "",
    frequency: "",
    weight: "",
  });
  const [plan, setPlan] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("powergymUser");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as AppUser;
      setUser(parsed);
    } catch (e) {
      console.error("Cannot parse powergymUser", e);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setError(null);
    setInfo(null);

    if (!form.goal || !form.level || !form.frequency) {
      setError("Заповніть ціль, рівень і частоту тренувань.");
      return;
    }

    setGenerating(true);
    try {
      const planText = buildPlan(form);
      setPlan(planText);
      setInfo("План згенеровано. Можна зберегти в профіль.");
    } catch (e) {
      console.error(e);
      setError("Помилка генерації плану. Спробуйте ще раз.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToProfile = async () => {
    setError(null);
    setInfo(null);

    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (!plan) {
      setError("Згенеруйте план перед збереженням.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...form,
          text: plan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Не вдалося зберегти план.");
      } else {
        setInfo("План збережено в профілі.");
      }
    } catch (e) {
      console.error(e);
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-2">
            AI-тренер
          </h1>
          <p className="text-center text-sm md:text-base text-slate-700 mb-6">
            Заповніть дані, а AI складе план тренувань з вправами, підходами та прогресією.
          </p>

          <div className="mx-auto max-w-md space-y-3">
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Вік"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE] bg-white"
            >
              <option value="">Стать</option>
              <option value="чоловік">Чоловік</option>
              <option value="жінка">Жінка</option>
              <option value="інше">Інше</option>
            </select>
            <input
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Вага (кг)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <input
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Ціль (схуднення, набір м'язів, тонус...)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <input
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Рівень (початківець, середній, просунутий)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <input
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="Частота (наприклад, 3-4 тренування/тиждень)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-full bg-[#8DD9BE] px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#7ACDAE] disabled:opacity-60"
            >
              {generating ? "Генеруємо..." : "Згенерувати план"}
            </button>

            {user && (
              <button
                onClick={handleSaveToProfile}
                disabled={saving || !plan}
                className="w-full rounded-full bg-black text-white px-4 py-2 text-sm font-semibold shadow-md hover:bg-black/80 disabled:opacity-50"
              >
                {saving ? "Зберігаємо..." : "Зберегти в профіль"}
              </button>
            )}

            {!user && (
              <p className="text-[11px] text-center text-slate-500">
                Щоб зберегти план у профіль, увійдіть в систему.
              </p>
            )}

            {error && <p className="text-[11px] text-center text-red-600">{error}</p>}
            {info && <p className="text-[11px] text-center text-emerald-700">{info}</p>}
          </div>

          <div className="mt-8 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] px-6 py-5">
            <h2 className="text-sm md:text-base font-extrabold mb-2">
              Згенерований AI-план
            </h2>
            {!plan ? (
              <p className="text-xs text-slate-600">
                Згенеруйте план, натиснувши “Згенерувати план”.
              </p>
            ) : (
              <pre className="whitespace-pre-wrap text-xs text-slate-800">{plan}</pre>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
