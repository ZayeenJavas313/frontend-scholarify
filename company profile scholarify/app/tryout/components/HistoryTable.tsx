"use client";
import { useEffect, useState } from "react";
import "../styles/HistoryTable.css";
import { fetchRiwayatNilai } from "@/app/lib/clientApi";

type HistoryItem = {
  batch: string;
  date: string;
  subtest: string;
  subtestCode: string;
  score: number;
  jumlahBenar: number;
  jumlahSalah: number;
  jumlahKosong: number;
  status: "Selesai" | "Belum";
};

export default function HistoryTable() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // ambil username dari session
        const res = await fetch("/api/check-session");
        const data = await res.json();
        
        const user = data?.user?.username && typeof data.user.username === "string"
          ? data.user.username
          : null;
        
        setUsername(user);
        
        if (!user) {
          // fallback ke localStorage jika belum login
    const stored = localStorage.getItem("tryout_history");
    const parsed: HistoryItem[] = stored ? JSON.parse(stored) : [];
          parsed.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setHistory(parsed);
          setLoading(false);
          return;
        }
        
        // ambil dari API Django
        try {
          const riwayat = await fetchRiwayatNilai(user);
          console.log("Riwayat dari API untuk user", user, ":", riwayat);
          
          if (!riwayat || riwayat.length === 0) {
            console.log("Tidak ada riwayat dari API, mungkin belum ada data yang tersubmit");
            setHistory([]);
            setLoading(false);
            return;
          }
        
        // Convert setiap item menjadi HistoryItem terpisah (tidak di-group)
        const historyItems: HistoryItem[] = riwayat.map((item: any) => {
          // Pastikan skor valid dalam range 0-100
          let skor = typeof item.skor === 'number' ? item.skor : 0;
          if (isNaN(skor) || skor < 0) skor = 0;
          if (skor > 100) skor = 100;
          
          return {
            batch: item.batch_id,
            date: item.tanggal,
            subtest: item.subtest_nama,
            subtestCode: item.subtest_code,
            score: Math.round(skor),
            jumlahBenar: item.jumlah_benar || 0,
            jumlahSalah: item.jumlah_salah || 0,
            jumlahKosong: item.jumlah_kosong || 0,
            status: "Selesai" as const,
          };
        });

        // urutkan dari terbaru ke lama, kemudian by batch, kemudian by subtest code
        historyItems.sort((a, b) => {
          const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateCompare !== 0) return dateCompare;
          
          const batchCompare = a.batch.localeCompare(b.batch);
          if (batchCompare !== 0) return batchCompare;
          
          return a.subtestCode.localeCompare(b.subtestCode);
        });
        
          setHistory(historyItems);
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
          throw apiError; // re-throw untuk ditangani di catch luar
        }
      } catch (error) {
        console.error("Error loading history:", error);
        // fallback ke localStorage
        const stored = localStorage.getItem("tryout_history");
        const parsed: HistoryItem[] = stored ? JSON.parse(stored) : [];
    parsed.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setHistory(parsed);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-slate-500 text-sm mt-8">
        Memuat riwayat...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm mt-8">
        Belum ada riwayat pengerjaan tryout.
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Riwayat Pengerjaan & Nilai TryOut
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold">
              <th className="px-4 py-2 rounded-l-lg">Batch</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Subtest</th>
              <th className="px-4 py-2">Skor</th>
              <th className="px-4 py-2 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={`${item.batch}-${item.subtestCode}-${idx}`}
                className={`border-b last:border-0 hover:bg-slate-50 transition`}
              >
                <td className="px-4 py-3 font-medium text-slate-700">
                  {item.batch}
                </td>
                <td className="px-4 py-3 text-slate-600">{item.date}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.subtest}
                </td>
                <td className="px-4 py-3 font-semibold text-[#4B2F1F]">
                  {typeof item.score === 'number' && !isNaN(item.score) ? Math.max(0, Math.min(100, Math.round(item.score))) : 0}%
                </td>
                <td className="px-4 py-3">
                  {item.status === "Selesai" ? (
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-xs">
                      {item.status}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full text-xs">
                      {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Ringkasan Nilai */}
        {history.length > 0 && (
          <div className="flex flex-wrap justify-end items-center gap-4 text-sm text-slate-700 mb-3 mt-4">
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
              <strong>Total TryOut Selesai:</strong> {new Set(history.map(item => `${item.batch}-${item.date}`)).size}
            </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
              <strong>Total Subtest Selesai:</strong> {history.length}
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-100">
              Rata-rata Skor: {history.length > 0 ? Math.max(0, Math.min(100, Math.round(history.reduce((sum, item) => sum + (typeof item.score === 'number' && !isNaN(item.score) ? item.score : 0), 0) / history.length))) : 0}%
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
