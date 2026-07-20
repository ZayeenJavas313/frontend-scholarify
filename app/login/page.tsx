"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Login() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/tryout";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        throw new Error("Gagal memparse response dari server");
      }

      if (!res.ok) throw new Error(data?.error || "Gagal login");
      if (!data?.ok) throw new Error(data?.error || "Gagal login");
      if (!data?.user) throw new Error("Response tidak valid: user tidak ditemukan");

      const userRole = data?.user?.role || "student";
      await new Promise(resolve => setTimeout(resolve, 100));

      if (userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = from;
      }
    } catch (e: any) {
      setErr(e.message || "Gagal login. Pastikan backend Django berjalan di http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memuat...
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-slate-800">Masuk</h1>
            <p className="text-xs text-slate-400">Hubungi admin untuk mendapatkan akun</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-300 focus:bg-white focus:border-slate-300 focus:ring-0 transition-colors"
                placeholder="username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3.5 pr-10 text-sm border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-300 focus:bg-white focus:border-slate-300 focus:ring-0 transition-colors"
                  placeholder="password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 hover:text-slate-600 active:text-slate-800 touch-manipulation"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {err && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center"><div className="text-sm text-slate-400">Loading...</div></div>}>
      <Login />
    </Suspense>
  );
}