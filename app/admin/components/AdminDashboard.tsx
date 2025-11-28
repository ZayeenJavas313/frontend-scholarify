"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsCards from "./StatsCards";
import SubtestStats from "./SubtestStats";
import TopUsers from "./TopUsers";
import SoalList from "./SoalList";
import UsersList from "./UsersList";
import HasilList from "./HasilList";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

interface AdminDashboardProps {
  user: { username: string; name: string; role?: string } | null;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "soal" | "users" | "hasil">("dashboard");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Ambil username dari session
      const sessionRes = await fetch("/api/check-session");
      const sessionData = await sessionRes.json();
      const username = sessionData?.user?.username || "";
      
      if (!username) {
        alert("Session tidak valid. Silakan login ulang.");
        router.replace("/login");
        return;
      }
      
      const res = await fetch(`${API_BASE_URL}/admin/dashboard/?username=${encodeURIComponent(username)}`, {
        credentials: "include",
      });

      if (res.status === 403) {
        alert("Akses ditolak. Hanya admin yang bisa mengakses halaman ini.");
        router.replace("/tryout");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Gagal memuat data dashboard. Pastikan backend berjalan dan Anda adalah admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
              <p className="text-sm text-slate-500">Selamat datang, {user?.name || user?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/tryout")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Kembali ke Tryout
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "soal", label: "Bank Soal" },
              { id: "users", label: "Pengguna" },
              { id: "hasil", label: "Hasil Tryout" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-[#EEC0A3] text-[#4B2F1F]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EEC0A3] mx-auto mb-4"></div>
                <p className="text-slate-600">Memuat data...</p>
              </div>
            ) : dashboardData ? (
              <>
                <StatsCards stats={dashboardData.stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SubtestStats data={dashboardData.subtest_stats} />
                  <TopUsers data={dashboardData.top_users} />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Gagal memuat data dashboard
              </div>
            )}
          </div>
        )}

        {activeTab === "soal" && <SoalList />}
        {activeTab === "users" && <UsersList />}
        {activeTab === "hasil" && <HasilList />}
      </main>
    </div>
  );
}
