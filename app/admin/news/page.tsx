"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminNewsPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAdmin = localStorage.getItem("powergymAdmin") === "true";
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [router]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !shortDescription.trim() || !fullDescription.trim()) {
      setMessage("Заповни заголовок, короткий та повний опис!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | undefined;

      // 1) Завантажуємо файл, якщо є
      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const upload = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!upload.ok) {
          const err = await upload.json().catch(() => ({}));
          throw new Error(err.error || "Помилка завантаження зображення");
        }

        const data = await upload.json();
        imageUrl = data.url;
      }

      // 2) Створюємо новину
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          image: imageUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Помилка збереження новини");
      }

      setTitle("");
      setShortDescription("");
      setFullDescription("");
      setFile(null);
      setPreview(null);
      setMessage("✅ Новину додано!");
    } catch (err: any) {
      setMessage("❌ " + (err.message || "Щось пішло не так"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Адмін: Новини та акції</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-black/10 bg-white p-5 shadow"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Заголовок</label>
            <input
              className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Короткий опис (для картки)
            </label>
            <textarea
              className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[60px]"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Повний опис (для модального вікна)
            </label>
            <textarea
              className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px]"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Зображення (файл)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            {preview && (
              <div className="mt-3 h-32 w-full overflow-hidden rounded-md border border-black/10 bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Превʼю" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {message && <p className="text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black hover:bg-primary/80 disabled:opacity-60"
          >
            {loading ? "Зберігаю..." : "Зберегти новину"}
          </button>
        </form>
      </section>
    </main>
  );
}
