export default function AdminHomePage() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">
          Адмін-панель PowerGYM
        </h1>
        <p className="text-sm text-slate-700 mb-6">
          Обери розділ зліва: можна додати тренера, тренування, новини,
          опрацьовувати повідомлення клієнтів та призначати персональні
          тренування.
        </p>
  
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] px-5 py-4 text-sm">
            <h2 className="font-bold mb-2">Управління контентом</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li>Додати / змінити тренування</li>
              <li>Додати / змінити тренера</li>
              <li>Публікувати новини та акції</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] px-5 py-4 text-sm">
            <h2 className="font-bold mb-2">Робота з клієнтами</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li>Читати повідомлення з форми контактів</li>
              <li>Призначати персональні тренування з тренером</li>
              <li>Переглядати записи клієнтів на тренування</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  