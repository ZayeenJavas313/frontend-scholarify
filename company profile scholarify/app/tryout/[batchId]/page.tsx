import Link from "next/link";
import { batches, type Batch } from "@/data/batches";

// ambil angka dari "batch-3" → 3
function extractNumber(slug: string): number | null {
  const m = slug.match(/(\d+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isNaN(n) ? null : n;
}

// cari batch dari data
function findBatch(param: string): Batch | null {
  const lower = param.toLowerCase();
  const num = extractNumber(lower);

  for (const b of batches) {
    const idStr = b.id.toString(); // "1"
    const slug = `batch-${idStr}`; // "batch-1"
    const titleSlug = b.title.toLowerCase().replace(/\s+/g, "-");

    if (lower === idStr) return b;
    if (lower === slug) return b;
    if (num !== null && b.id === num) return b;
    if (lower === titleSlug) return b;
  }

  return null;
}

// fallback kalau slug gak ketemu di data
function makeFallback(param: string): Batch {
  const num = extractNumber(param);
  return {
    id: num ?? 0,
    title: num ? `TryOut Batch ${num}` : "TryOut",
    date: "–",
    status: "available",
    duration: 90,
    description: "",
  };
}

// ⬇️ Next.js 16: params itu Promise → harus di-await
export default async function TryoutInstructionPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params; // misal "batch-1"
  const batchFromData = findBatch(batchId);
  const batch =
    batchFromData ??
    (batches.length > 0 ? (batches[0] as Batch) : makeFallback(batchId));

  // kita bikin slug canonical biar tombolnya konsisten
  const canonicalBatchId =
    typeof batch.id === "number" ? `batch-${batch.id}` : batch.id;

  const isLocked = batch.status === "locked";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-7">
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-blue-700 bg-blue-50 inline-flex px-3 py-1 rounded-full">
            TryOut • {batch.date}
          </p>
          <Link
            href="/tryout"
            className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
          >
            ← Kembali ke daftar
          </Link>
        </div>

        {/* judul */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{batch.title}</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Baca instruksi singkat berikut sebelum memulai tryout.
          </p>
        </div>

        {/* info ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400">Status</p>
            {isLocked ? (
              <span className="mt-2 inline-flex px-4 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-medium">
                Terkunci
              </span>
            ) : (
              <span className="mt-2 inline-flex px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                Tersedia
              </span>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400">Batch</p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {canonicalBatchId}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400">Perkiraan durasi</p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              ± {batch.duration ?? 90} menit
            </p>
          </div>
        </div>

        {/* instruksi */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Instruksi pengerjaan
            </h2>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
              <li>Pastikan koneksi internet stabil.</li>
              <li>Waktu berjalan setelah kamu menekan tombol “Mulai TryOut”.</li>
              <li>Jangan tutup / refresh browser selama pengerjaan.</li>
              <li>Nilai akan dihitung otomatis.</li>
            </ul>
          </div>

          {/* permintaan client: sekali pengerjaan */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm flex gap-3">
            <span className="mt-1">⚠️</span>
            <div>
              <p className="font-semibold">Penting:</p>
              <p>
                Setiap <strong>subtest</strong> hanya dapat dikerjakan{" "}
                <strong>1 kali</strong>. Jika waktu berakhir atau kamu
                menyelesaikan subtest, akses ke subtest tersebut akan{" "}
                <strong>dikunci</strong> dan tidak bisa dibuka kembali.
              </p>
              <p className="mt-1 text-[12px] text-amber-700/80">
                Jika terjadi kendala (listrik, jaringan, atau perangkat), silakan
                hubungi admin/panitia untuk pembukaan ulang oleh sistem.
              </p>
            </div>
          </div>
        </section>

        {/* tombol */}
        <div className="flex justify-end">
          {isLocked ? (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl px-4 py-3 text-sm flex items-center gap-4">
              <p>Batch ini belum dibuka.</p>
              <Link
                href="/tryout"
                className="text-xs px-3 py-1.5 rounded-lg bg-white/50 border border-rose-100 text-rose-600"
              >
                Pilih batch lain
              </Link>
            </div>
          ) : (
            <Link
              href={`/tryout/${canonicalBatchId}/do`}
              className="inline-flex items-center gap-2 bg-[#EEC0A3] hover:bg-[#D9A684] text-[#4B2F1F] px-5 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Mulai TryOut sekarang →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
