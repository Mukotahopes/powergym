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
};

// Простенький “AI” для генерації тексту
function generatePlanText({
  age,
  sex,
  goal,
  level,
  frequency,
}: FormState): string {
  const ageText = age ? `${age} років` : "будь-якого віку";
  const sexText = sex || "будь-якої статі";

  let goalBlock = "";
  if (goal.toLowerCase().includes("схуд")) {
    goalBlock =
      "- Акцент на дефіцит калорій, кардіо та кругові тренування для всього тіла.\n" +
      "- Більше повторень (12–20) з помірною вагою.\n";
  } else if (goal.toLowerCase().includes("маса") || goal.toLowerCase().includes("м'яз")) {
    goalBlock =
      "- Акцент на базових вправах з прогресивним навантаженням.\n" +
      "- 6–12 повторень, 3–4 підходи, достатній відпочинок між підходами.\n";
  } else {
    goalBlock =
      "- Фокус на загальній фізичній підготовці, мобільності та здоров'ї.\n" +
      "- Комбінація силових, функціональних та легкого кардіо.\n";
  }

  let levelText = "";
  if (level.toLowerCase().includes("почат")) {
    levelText =
      "- Навчання техніці: легкі ваги, повільне збільшення складності.\n" +
      "- 2–3 базові вправи на групу м'язів.\n";
  } else if (level.toLowerCase().includes("серед")) {
    levelText =
      "- Можна працювати з більшою вагою, спліт-програми (верх/низ, push/pull/legs).\n";
  } else if (level.toLowerCase().includes("просун")) {
    levelText =
      "- Складніші схеми (superset, dropset), контроль відновлення та об'єму.\n";
  } else {
    levelText = "- Рівень не вказано — план буде універсальним.\n";
  }

  const freqText = frequency
    ? `Тренувань на тиждень: ${frequency}.`
    : "Кількість тренувань можна гнучко адаптувати під твій графік.";

  return (
    `AI-план тренувань\n` +
    `-----------------------\n\n` +
    `Профіль: ${ageText}, ${sexText}.\n` +
    `Ціль: ${goal || "загальний розвиток"}.\n` +
    `${freqText}\n\n` +
    `1. Розминка (5–10 хв)\n` +
    `- Легке кардіо (бігова доріжка, орбітрек, скакалка).\n` +
    `- Рухлива розминка для суглобів (кола руками, оберти тазу, нахили).\n\n` +
    `2. Основна частина\n` +
    goalBlock +
    levelText +
    `Приклад структури тренування:\n` +
    `- День 1: Ноги + Ягодиці\n` +
    `- День 2: Груди + Плечі\n` +
    `- День 3: Спина + Прес\n\n` +
    `3. Функціональний блок (опційно)\n` +
    `- Планка, берпі, випади, вправи з власною вагою для витривалості.\n\n` +
    `4. Заминка (5–10 хв)\n` +
    `- Легке кардіо + статичні розтяжки основних груп м'язів.\n\n` +
    `Пам'ятай: це базовий AI-план. Твій тренер у залі може допомогти адаптувати його ` +
    `під особливості здоров'я та навантажень.`
  );
}

export default function AiTrainerPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState<FormState>({
    age: "",
    sex: "",
    goal: "",
    level: "",
    frequency: "",
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

  const handleGenerate = () => {
    setError(null);
    setInfo(null);

    if (!form.goal || !form.level || !form.frequency) {
      setError("Будь ласка, заповни ціль, рівень та частоту тренувань.");
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      const text = generatePlanText(form);
      setPlan(text);
      if (!user?.id) {
        setInfo("План згенеровано. Увійди в акаунт, щоб зберегти його в профілі.");
      } else {
        setInfo("План згенеровано. Ти можеш зберегти його в профілі.");
      }
      setGenerating(false);
    }, 300); // трохи "магії" 🙂
  };

  const handleSaveToProfile = async () => {
    setError(null);
    setInfo(null);

    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (!plan) {
      setError("Спочатку згенеруй план, а потім збережи його в профіль.");
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
        setInfo("План збережено в профілі 🎉");
      }
    } catch (e) {
      console.error(e);
      setError("Сталася помилка. Спробуй ще раз.");
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
            Наш AI аналізує твої цілі, рівень підготовки та час — й пропонує
            базовий індивідуальний план тренувань.
          </p>

          {/* Форма */}
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
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Ціль (схуднення, маса, витривалість...)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <input
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Рівень (початковий, середній, просунутий)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />
            <input
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="Частота (наприклад, 3–4 рази на тиждень)"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#8DD9BE]"
            />

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-full bg-[#8DD9BE] px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#7ACDAE] disabled:opacity-60"
            >
              {generating ? "Створюємо..." : "Створити програму"}
            </button>

            {user && (
              <button
                onClick={handleSaveToProfile}
                disabled={saving || !plan}
                className="w-full rounded-full bg-black text-white px-4 py-2 text-sm font-semibold shadow-md hover:bg-black/80 disabled:opacity-50"
              >
                {saving ? "Зберігаємо..." : "Додати план в профіль"}
              </button>
            )}

            {!user && (
              <p className="text-[11px] text-center text-slate-500">
                Щоб зберегти план в профіль, увійди в акаунт.
              </p>
            )}

            {error && (
              <p className="text-[11px] text-center text-red-600">{error}</p>
            )}
            {info && (
              <p className="text-[11px] text-center text-emerald-700">{info}</p>
            )}
          </div>

          {/* Блок з результатом */}
          <div className="mt-8 rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] px-6 py-5">
            <h2 className="text-sm md:text-base font-extrabold mb-2">
              Згенерований AI-план
            </h2>
            {!plan ? (
              <p className="text-xs text-slate-600">
                Ваш AI-план з&#39;явиться тут після натискання кнопки
                &quot;Створити програму&quot;.
              </p>
            ) : (
              <pre className="whitespace-pre-wrap text-xs text-slate-800">
                {plan}
              </pre>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
