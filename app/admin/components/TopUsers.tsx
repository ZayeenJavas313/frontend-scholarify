"use client";

interface TopUsersProps {
  data: Array<{
    username: string;
    name: string;
    avg_skor: number;
    total_pengerjaan: number;
  }>;
}

export default function TopUsers({ data }: TopUsersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Pengguna</h2>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Belum ada data</p>
      ) : (
        <div className="space-y-3">
          {data.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEC0A3] flex items-center justify-center text-sm font-bold text-[#4B2F1F]">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">@{user.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.avg_skor}%</p>
                <p className="text-xs text-slate-500">{user.total_pengerjaan} kali</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

