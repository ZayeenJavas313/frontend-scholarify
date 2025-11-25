"use client";

interface SubtestStatsProps {
  data: Array<{
    code: string;
    nama: string;
    jumlah_soal: number;
    total_pengerjaan: number;
    avg_skor: number;
  }>;
}

export default function SubtestStats({ data }: SubtestStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Statistik Per Subtest</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Subtest
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Soal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pengerjaan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rata-rata Skor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{item.nama}</div>
                  <div className="text-xs text-slate-500">{item.code}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                  {item.jumlah_soal}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                  {item.total_pengerjaan}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    {item.avg_skor.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

