import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AiPlan from "@/models/AiPlan";

// GET /api/ai-plan?userId=...
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const plan = (await AiPlan.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .lean()) as any;

  if (!plan) {
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json({
    id: String(plan._id),
    age: plan.age,
    sex: plan.sex,
    goal: plan.goal,
    level: plan.level,
    frequency: plan.frequency,
    text: plan.text,
    createdAt: plan.createdAt,
  });
}

// POST /api/ai-plan
// body: { userId, age, sex, goal, level, frequency, text }
export async function POST(req: Request) {
  await connectDB();

  const body = (await req.json()) as {
    userId?: string;
    age?: string;
    sex?: string;
    goal?: string;
    level?: string;
    frequency?: string;
    text?: string;
  };

  const { userId, age, sex, goal, level, frequency, text } = body;

  if (!userId || !text) {
    return NextResponse.json(
      { error: "userId and text are required" },
      { status: 400 }
    );
  }

  const created = await AiPlan.create({
    user: userId,
    age,
    sex,
    goal,
    level,
    frequency,
    text,
  });

  return NextResponse.json(
    {
      id: created._id.toString(),
      text: created.text,
      createdAt: created.createdAt,
    },
    { status: 201 }
  );
}
