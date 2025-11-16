import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-primary text-dark/90 p-10 my-8 rounded-2xl text-center shadow">
        <h1 className="text-4xl font-bold mb-2">Перевірка Tailwind </h1>
        <p>Якщо цей блок кольоровий  Tailwind працює.</p>
      </section>
    </main>
  );
}
