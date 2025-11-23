"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PlanId = "free" | "plus" | "premium";

type AppUser = {
  id?: string;
  email?: string;
  name?: string;
  subscription?: PlanId;
  subscriptionUntil?: string | null;
};

const plans: {
  id: PlanId;
  title: string;
  price: string;
  priceValue?: number;
  badge?: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "free",
    title: "Free",
    price: "0 грн / міс",
    priceValue: 0,
    description: "Базовий доступ без оплати.",
    features: [
      "Огляд розкладу та новин клубу",
      "Запис на відкриті тренування",
      "Безкоштовні нагадування",
    ],
  },
  {
    id: "plus",
    title: "Розумний старт",
    price: "600 грн / міс",
    priceValue: 600,
    badge: "Популярно",
    description: "Більше тренувань + розширені функції.",
    features: [
      "Повний доступ до групових занять",
      "Базові рекомендації по плану",
      "Знижки на персональні сесії",
    ],
  },
  {
    id: "premium",
    title: "Преміум (макс. доступ)",
    price: "800 грн / міс",
    priceValue: 800,
    badge: "Найбільша цінність",
    description: "Усе включено без обмежень.",
    features: [
      "Усі тренування без лімітів",
      "Персональні рекомендації та аналітика",
      "Запис до топ‑тренерів без черг",
    ],
  },
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liqPayPlan, setLiqPayPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("powergymUser");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AppUser;
      setUser(parsed);
    } catch (e) {
      console.error("Cannot parse powergymUser", e);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSelectPlan = async (planId: PlanId) => {
    if (!user?.id) return;
    setError(null);
    setSavingPlan(planId);

    try {
      const res = await fetch("/api/user/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subscription: planId,
        }),
      });

      const data = await res.json();
      const updated: AppUser = {
        ...user,
        subscription: data.subscription as PlanId,
        subscriptionUntil: data.subscriptionUntil ?? null,
      };

      if (!res.ok) {
        setError(data?.error || "Не вдалося зберегти підписку");
        setSavingPlan(null);
        return;
      }

      // Оновлюємо стейт + localStorage
      setUser(updated);
      localStorage.setItem("powergymUser", JSON.stringify(updated));

      // Переходимо в профіль
      router.push("/profile");
    } catch (e) {
      console.error(e);
      setError("Сталась помилка. Спробуйте ще раз.");
      setSavingPlan(null);
    }
  };

  /**
   * LiqPay sandbox checkout: отримує data/signature з бекенду і відкриває форму LiqPay.
   * Після сабміту одразу застосовуємо підписку для демо-сценарію.
   */
  const handleLiqPayCheckout = async (planId: PlanId) => {
    if (!user?.id || savingPlan || liqPayPlan || planId === "free") return;
    setError(null);
    setLiqPayPlan(planId);

    try {
      const res = await fetch("/api/liqpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "LiqPay недоступний");
      }

      const { data, signature, actionUrl } = (await res.json()) as {
        data: string;
        signature: string;
        actionUrl: string;
      };

      // Створюємо приховану форму й відправляємо в новій вкладці
      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;
      form.target = "_blank";

      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = data;

      const signatureInput = document.createElement("input");
      signatureInput.type = "hidden";
      signatureInput.name = "signature";
      signatureInput.value = signature;

      form.appendChild(dataInput);
      form.appendChild(signatureInput);
      document.body.appendChild(form);
      form.submit();
      form.remove();

      // Демо: одразу застосовуємо підписку (sandbox)
      await handleSelectPlan(planId);
    } catch (e) {
      console.error("LiqPay checkout error", e);
      setError("LiqPay недоступний. Спробуйте пізніше.");
    } finally {
      setLiqPayPlan(null);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#F4F7F6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-600">
          Завантаження...
        </div>
        <Footer />
      </main>
    );
  }

  const current = user.subscription ?? "free";

  return (
    <main className="min-h-screen bg-[#F4F7F6] flex flex-col text-black">
      <Navbar />

      <div className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold">
            Оберіть підписку
          </h1>
          <p className="mt-2 text-center text-sm md:text-base text-slate-700">
            Керуйте доступом, щоб отримати більше. Поточна підписка:{" "}
            <span className="font-semibold">
              {current === "premium"
                ? "Преміум"
                : current === "plus"
                ? "Розумний старт"
                : "Free"}
            </span>
          </p>

          {error && (
            <p className="mt-4 text-center text-xs text-red-600">{error}</p>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = current === plan.id;
              const isSaving = savingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] p-5 border ${
                    isCurrent ? "border-[#8DD9BE]" : "border-transparent"
                  }`}
                >
                  {plan.badge && (
                    <span className="mb-2 inline-block rounded-full bg-[#8DD9BE]/20 px-3 py-0.5 text-[10px] font-semibold text-[#116652]">
                      {plan.badge}
                    </span>
                  )}

                  <h2 className="text-lg font-extrabold mb-1">{plan.title}</h2>
                  <p className="text-sm text-slate-700 mb-2">
                    {plan.description}
                  </p>

                  <p className="text-xl font-extrabold mb-3">{plan.price}</p>

                  <ul className="mb-4 flex-1 space-y-1.5 text-xs text-slate-700">
                    {plan.features.map((f, idx) => (
                      <li key={idx}>• {f}</li>
                    ))}
                  </ul>

                  <div className="mt-auto space-y-2">
                    <button
                      disabled={isCurrent || isSaving}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full rounded-full px-4 py-2 text-xs font-semibold shadow-md ${
                        isCurrent
                          ? "bg-slate-200 text-slate-600 cursor-default"
                          : "bg-[#8DD9BE] text-black hover:bg-[#7ACDAE]"
                      } disabled:opacity-70`}
                    >
                      {isCurrent
                        ? "Поточна підписка"
                        : isSaving && savingPlan === plan.id
                        ? "Збереження..."
                        : "Обрати"}
                    </button>

                    {plan.id !== "free" && (
                      <button
                        disabled={isCurrent || liqPayPlan === plan.id || isSaving}
                        onClick={() => handleLiqPayCheckout(plan.id)}
                        className="w-full rounded-full border border-[#3cba54] px-4 py-2 text-[11px] font-semibold text-[#116652] bg-white hover:bg-[#ecfff5] shadow-sm disabled:opacity-60"
                      >
                        {liqPayPlan === plan.id
                          ? "LiqPay..."
                          : "Оплатити через LiqPay"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
