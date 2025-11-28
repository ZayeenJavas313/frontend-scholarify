"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Ambil username dari session
      const sessionRes = await fetch("/api/check-session");
      const sessionData = await sessionRes.json();
      const username = sessionData?.user?.username || "";
      
      if (!username) {
        alert("Session tidak valid. Silakan login ulang.");
        return;
      }
      
      const res = await fetch(`${API_BASE_URL}/admin/users/?username=${encodeURIComponent(username)}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Daftar Pengguna</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EEC0A3] mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Pengerjaan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rata-rata Skor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.email || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_staff
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.is_staff ? "Admin" : "Siswa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.total_hasil}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {user.avg_skor}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

