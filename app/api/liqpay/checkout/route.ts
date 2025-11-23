import { NextResponse } from "next/server";
import crypto from "crypto";

type PlanId = "plus" | "premium";

const PRICE: Record<PlanId, number> = {
  plus: 600,
  premium: 800,
};

const base64 = (data: string) => Buffer.from(data).toString("base64");
const sign = (privateKey: string, data: string) =>
  crypto.createHash("sha1").update(privateKey + data + privateKey).digest("base64");

export async function POST(request: Request) {
  const body = (await request.json()) as { planId?: PlanId };
  const { planId } = body;

  if (!planId || !(planId in PRICE)) {
    return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
  }

  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "LiqPay keys are not configured on the server" },
      { status: 500 }
    );
  }

  const amount = PRICE[planId];
  const description =
    planId === "premium" ? "Підписка PowerGym Premium (sandbox)" : "Підписка PowerGym Plus (sandbox)";

  const payload = {
    version: 3,
    public_key: publicKey,
    action: "pay",
    amount,
    currency: "UAH",
    description,
    order_id: `sub-${planId}-${Date.now()}`,
    sandbox: 1,
  };

  const data = base64(JSON.stringify(payload));
  const signature = sign(privateKey, data);

  return NextResponse.json({
    data,
    signature,
    actionUrl: "https://www.liqpay.ua/api/3/checkout",
  });
}
