import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PersonalTraining from "@/models/PersonalTraining";
import User from "@/models/User";
import Trainer from "@/models/Trainer";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query: any = {};
    if (userId) query.user = userId;

    const list = await PersonalTraining.find(query)
      .populate("user", "name email")
      .populate("trainer", "firstName lastName")
      .sort({ date: 1 })
      .lean();

    const mapped = list.map((pt: any) => ({
      id: String(pt._id),
      title: pt.title,
      plan: pt.plan,
      date: pt.date,
      status: pt.status,
      user: pt.user
        ? {
            id: String(pt.user._id),
            name: pt.user.name,
            email: pt.user.email,
          }
        : null,
      trainer: pt.trainer
        ? {
            id: String(pt.trainer._id),
            name: `${pt.trainer.firstName} ${pt.trainer.lastName}`,
          }
        : null,
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (e) {
    console.error("GET /api/personal-trainings error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as {
      userEmail?: string;
      trainerId?: string;
      title?: string;
      plan?: string;
      date?: string; // ISO
    };

    const { userEmail, trainerId, title, plan, date } = body;

    if (!userEmail || !trainerId || !title || !plan || !date) {
      return NextResponse.json(
        { error: "Вкажіть email користувача, тренера, назву, план і дату" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: userEmail }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Користувача з таким email не знайдено" },
        { status: 404 }
      );
    }

    const trainer = await Trainer.findById(trainerId).lean();
    if (!trainer) {
      return NextResponse.json(
        { error: "Тренера не знайдено" },
        { status: 404 }
      );
    }

    const created = await PersonalTraining.create({
      user: (user as any)._id,
      trainer: trainerId,
      title,
      plan,
      date: new Date(date),
    });

    return NextResponse.json(
      {
        id: created._id.toString(),
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/personal-trainings error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
