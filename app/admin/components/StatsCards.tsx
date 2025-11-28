"use client";

interface StatsCardsProps {
  stats: {
    users: { total: number; students: number; admins: number };
    subtests: { total: number; total_soal: number };
    hasil_tryout: { total: number; dengan_skor: number; avg_skor: number };
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Pengguna",
      value: stats.users.total,
      subtitle: `${stats.users.students} siswa, ${stats.users.admins} admin`,
      color: "bg-blue-500",
    },
    {
      title: "Total Subtest",
      value: stats.subtests.total,
      subtitle: `${stats.subtests.total_soal} soal`,
      color: "bg-green-500",
    },
    {
      title: "Total Pengerjaan",
      value: stats.hasil_tryout.total,
      subtitle: `${stats.hasil_tryout.dengan_skor} dengan skor`,
      color: "bg-purple-500",
    },
    {
      title: "Rata-rata Skor",
      value: `${stats.hasil_tryout.avg_skor}%`,
      subtitle: "Dari semua pengerjaan",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
            </div>
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <span className="text-white text-2xl">📊</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

