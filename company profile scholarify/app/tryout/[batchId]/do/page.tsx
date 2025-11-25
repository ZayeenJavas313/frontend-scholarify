import Link from "next/link";
import { batches } from "@/data/batches";
import SubtestListClient from "@/app/components/SubtestListClient";
import { fetchSubtests, fetchSubtestQuestions } from "@/lib/api";
import type { Subtest as SubtestType } from "@/data/subtests";

export default async function DoPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;

  const batch = batches.find(
    (b) =>
      `batch-${String(b.id)}`.toLowerCase() === batchId.toLowerCase() ||
      String(b.id) === batchId
  );

  const title = batch?.title ?? "TryOut";
  
  // Fetch subtests from backend API
  let list: SubtestType[] = [];
  try {
    const backendSubtests = await fetchSubtests();
    // Map backend subtests to frontend format and add batchId
    list = backendSubtests.map((st) => ({
      id: st.id,
      batchId: batchId,
      title: st.title,
      description: st.description,
      duration: st.duration,
      questionCount: st.questionCount,
    }));
  } catch (error) {
    console.error("Error fetching subtests:", error);
    // Fallback to empty list if API fails
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <main className="mx-auto max-w-6xl px-4 pt-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Pilih subtest untuk dikerjakan</p>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <Link
            href={`/tryout/${batchId}`}
            className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 self-start md:self-auto"
          >
            ← Kembali ke instruksi
          </Link>
        </div>

        {/* GRID SUBTEST + STATUS SELESAI */}
        <SubtestListClient batchId={batchId} subtests={list} />
      </main>
    </div>
  );
}
