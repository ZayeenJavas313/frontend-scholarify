"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Komponen TambahSoalForm
interface TambahSoalFormProps {
  onClose: () => void;
  onTambahSoal: (data: any) => void;
}

const TambahSoalForm = ({ onClose, onTambahSoal }: TambahSoalFormProps) => {
  const [formData, setFormData] = useState({
    pertanyaan: '',
    pilihan: ['', '', '', '', ''],
    kunci_jawaban: '',
    subtest: 'PU',
  });
  const [error, setError] = useState('');

  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePilihanChange = (index: number, value: string) => {
    const newPilihan = [...formData.pilihan];
    newPilihan[index] = value;
    setFormData({ ...formData, pilihan: newPilihan });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.pertanyaan.trim()) {
      setError('Pertanyaan harus diisi');
      return;
    }
    
    const pilihanAktif = formData.pilihan.filter(p => p.trim() !== '');
    if (pilihanAktif.length < 2) {
      setError('Minimal harus ada 2 pilihan jawaban');
      return;
    }
    
    if (!formData.kunci_jawaban) {
      setError('Silakan pilih kunci jawaban');
      return;
    }

    try {
      // Format data untuk Django Admin
      const formDataToSend = new FormData();
      
      // Tambahkan field yang diperlukan
      formDataToSend.append('pertanyaan', formData.pertanyaan.trim());
      formDataToSend.append('subtest', formData.subtest);
      
      // Format pilihan menjadi teks dengan format: A. Pilihan A|B. Pilihan B|...
      const pilihanText = pilihanAktif
        .map((p, i) => `${String.fromCharCode(65 + i)}. ${p}`)
        .join('|');
      formDataToSend.append('pilihan', pilihanText);
      
      // Format kunci jawaban (A, B, C, dst)
      formDataToSend.append('kunci_jawaban', formData.kunci_jawaban);
      
      // Tambahkan CSRF token
      formDataToSend.append('csrfmiddlewaretoken', getCsrfToken());
      
      console.log('Mengirim data ke Django Admin...');
      
      const response = await fetch('http://127.0.0.1:8000/admin/quiz/soal/add/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formDataToSend,
        credentials: 'include',
      });

      // Dapatkan respon sebagai teks terlebih dahulu
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
      
      // Coba parse sebagai JSON, jika gagal gunakan teks biasa
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { detail: responseText };
      }
      
      // Periksa jika ada redirect ke halaman login
      if (response.redirected || response.status === 302) {
        window.location.href = '/login';
        return;
      }
      
      // Jika berhasil, halaman akan di-redirect ke daftar soal
      if (response.ok || response.status === 200) {
        window.location.reload(); // Reload untuk memastikan data terbaru
        return;
      }
      
      // Jika ada error
      let errorMessage = 'Gagal menambahkan soal. ';
      
      if (responseData.detail) {
        errorMessage += responseData.detail;
      } else if (responseData.message) {
        errorMessage += responseData.message;
      } else if (responseData.error) {
        errorMessage += responseData.error;
      } else if (responseData.__all__) {
        errorMessage += responseData.__all__.join(' ');
      } else if (typeof responseData === 'object') {
        errorMessage += JSON.stringify(responseData);
      } else {
        errorMessage += 'Periksa console untuk detail lebih lanjut.';
      }
      
      throw new Error(errorMessage);
      
    } catch (err) {
      console.error('Error saat mengirim soal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan soal. Periksa console untuk detail lebih lanjut.';
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tambah Soal Baru</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
            <textarea
              name="pertanyaan"
              value={formData.pertanyaan}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilihan Jawaban</label>
            <div className="space-y-2">
              {formData.pilihan.map((pilihan, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 font-medium">{String.fromCharCode(65 + index)}.</span>
                  <input
                    type="text"
                    value={pilihan}
                    onChange={(e) => handlePilihanChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban</label>
            <select
              name="kunci_jawaban"
              value={formData.kunci_jawaban}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
              required
            >
              <option value="">Pilih Kunci Jawaban</option>
              {formData.pilihan.map((p, index) => p.trim() !== '' && (
                <option key={index} value={String.fromCharCode(65 + index)}>
                  {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtest</label>
            <select
              name="subtest"
              value={formData.subtest}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
              required
            >
              <option value="PU">Penalaran Umum (PU)</option>
              <option value="PPU">Pengetahuan & Pemahaman Umum (PPU)</option>
              <option value="PBM">Pengetahuan Kuantitatif (PBM)</option>
              <option value="PK">Pengetahuan Kuantitatif (PK)</option>
              <option value="LBI">Literasi Bahasa Indonesia (LBI)</option>
              <option value="LBE">Literasi Bahasa Inggris (LBE)</option>
              <option value="PM">Penalaran Matematika (PM)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-[#EEC0A3] rounded-lg hover:bg-[#d9ab8b] transition-colors"
            >
              Simpan Soal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function SoalList() {
  const [soal, setSoal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState({ subtest_code: "", search: "" });
  const [showTambahForm, setShowTambahForm] = useState(false);

  useEffect(() => {
    fetchSoal();
  }, [page, filters]);

  const fetchSoal = async () => {
    try {
      setLoading(true);
      const sessionRes = await fetch("/api/check-session");
      const sessionData = await sessionRes.json();
      const username = sessionData?.user?.username || "";
      
      if (!username) {
        alert("Session tidak valid. Silakan login ulang.");
        return;
      }
      
      const params = new URLSearchParams({
        username: username,
        page: page.toString(),
        limit: "50",
      });
      if (filters.subtest_code) params.append("subtest_code", filters.subtest_code);
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(`${API_BASE_URL}/admin/soal/?${params}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengambil data soal");

      const data = await res.json();
      setSoal(data.results || []);
      setPagination(data.pagination || { 
        total: data.results?.length || 0, 
        has_prev: page > 1,
        has_next: false
      });
    } catch (error) {
      console.error("Error fetching soal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTambahSoal = (soalBaru: any) => {
    setSoal([soalBaru, ...soal]);
    setPagination((prev: any) => ({
      ...prev,
      total: (prev?.total || 0) + 1
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Bank Soal</h2>
          <button
            onClick={() => setShowTambahForm(true)}
            className="px-4 py-2 bg-[#EEC0A3] text-white text-sm font-medium rounded-lg hover:bg-[#d9ab8b] transition-colors"
          >
            + Tambah Soal
          </button>
        </div>
        
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Cari soal..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
          />
          <select
            value={filters.subtest_code}
            onChange={(e) => setFilters({ ...filters, subtest_code: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EEC0A3] focus:border-transparent"
          >
            <option value="">Semua Subtest</option>
            <option value="PU">Penalaran Umum (PU)</option>
            <option value="PPU">PPU</option>
            <option value="PBM">PBM</option>
            <option value="PK">PK</option>
            <option value="LBI">LBI</option>
            <option value="LBE">LBE</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {showTambahForm && (
        <TambahSoalForm
          onClose={() => setShowTambahForm(false)}
          onTambahSoal={handleTambahSoal}
        />
      )}

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
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subtest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Soal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gambar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kunci</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {soal.length > 0 ? (
                  soal.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600">{s.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{s.subtest_code || s.subtest}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 max-w-md">
                        {s.soal_text || s.pertanyaan}
                        {s.has_image && <span className="ml-2 text-xs text-blue-500">📷</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {s.has_image ? "✅" : "❌"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {s.correct_answer || s.kunci_jawaban}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      Tidak ada data soal
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {((page - 1) * 50) + 1} - {Math.min(page * 50, pagination.total)} dari {pagination.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination?.has_prev}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination?.has_next}
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