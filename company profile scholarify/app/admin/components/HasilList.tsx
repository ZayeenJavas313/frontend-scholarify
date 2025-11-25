"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function HasilList() {
  const [hasil, setHasil] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState({ username: "", subtest_code: "" });

  useEffect(() => {
    fetchHasil();
  }, [page, filters]);

  const fetchHasil = async () => {
    try {
      setLoading(true);
      // Ambil username admin dari session
      const sessionRes = await fetch("/api/check-session");
      const sessionData = await sessionRes.json();
      const adminUsername = sessionData?.user?.username || "";
      
      if (!adminUsername) {
        alert("Session tidak valid. Silakan login ulang.");
        return;
      }
      
      const params = new URLSearchParams({
        admin_username: adminUsername,
        page: page.toString(),
        limit: "50",
      });
      if (filters.username) params.append("username", filters.username);
      if (filters.subtest_code) params.append("subtest_code", filters.subtest_code);

      const res = await fetch(`${API_BASE_URL}/admin/hasil/?${params}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch hasil");

      const data = await res.json();
      setHasil(data.results);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching hasil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hasil Tryout</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Cari username..."
            value={filters.username}
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
          />
          <select
            value={filters.subtest_code}
            onChange={(e) => setFilters({ ...filters, subtest_code: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
          >
            <option value="">Semua Subtest</option>
            <option value="PU">PU</option>
            <option value="PPU">PPU</option>
            <option value="PBM">PBM</option>
            <option value="PK">PK</option>
            <option value="LBI">LBI</option>
            <option value="LBE">LBE</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EEC0A3] mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subtest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Benar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salah</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kosong</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Skor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {hasil.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-slate-900">{h.user_name}</div>
                      <div className="text-xs text-slate-500">@{h.username}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{h.subtest_code}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{h.batch_id}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-medium">{h.jumlah_benar}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{h.jumlah_salah}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{h.jumlah_kosong}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{h.skor}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {((page - 1) * 50) + 1} - {Math.min(page * 50, pagination.total)} dari {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.has_prev}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.has_next}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}