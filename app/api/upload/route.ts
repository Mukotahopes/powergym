import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // важливо!

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не передано" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Унікальне ім'я файлу
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    // Повний шлях до збереження
    const filepath = path.join(uploadDir, filename);

    // Пишемо файл в public/uploads
    await writeFile(filepath, buffer);

    // Повертаємо шлях, що буде доступним з браузера
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Помилка завантаження" }, { status: 500 });
  }
}
