"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import type { Subtest } from "@/data/subtests";

type Props = {
  batchId: string;
  subtests: Subtest[];
};

export default function SubtestListClient({ batchId, subtests }: Props) {
  const [doneMap, setDoneMap] = useState<Record<string, "done" | undefined>>({});
  const [storageKey, setStorageKey] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
    try {
        // ambil user yang sedang login
        const res = await fetch("/api/check-session");
        const data = await res.json();

        const username =
          data?.user?.username && typeof data.user.username === "string"
            ? data.user.username
            : "guest";

        const key = `tryout_progress_${username}_${batchId}`;
        setStorageKey(key);

        if (typeof window === "undefined") {
          setDoneMap({});
          return;
        }

      const raw = localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as Record<string, "done">) : {};
      setDoneMap(parsed || {});
    } catch {
      setDoneMap({});
    }
    };

    loadProgress();
  }, [batchId]);

  const isDone = (id: string) => doneMap[id] === "done";

  const Card = ({ st }: { st: Subtest }) => {
    const selesai = isDone(st.id);

    // support questionCount & totalQuestions
    const questions =
      (st as any).questionCount ??
      (st as any).totalQuestions ??
      undefined;

    // kelas kartu dengan animasi halus untuk yang aktif saja
    const cardClass =
      `relative rounded-[22px] border border-slate-100 bg-white px-8 py-8 
       shadow-sm transition-transform duration-200
       ${selesai ? "opacity-95"
                 : "hover:shadow-md hover:scale-[1.01] hover:-translate-y-[2px]"}`;

    return (
      <div className={cardClass} role="article">
        {/* pita status di atas */}
        {selesai && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
              </svg>
              Sudah dikerjakan
            </span>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-[22px] font-semibold text-slate-800 leading-snug">
            {st.title}
          </h3>
          <p className="mt-3 text-[15px] text-slate-600 leading-6 max-w-xs mx-auto">
            {st.description}
          </p>

          {/* badges */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Durasi: {st.duration ?? 0} menit
            </span>
            {typeof questions === "number" && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {questions} soal
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6">
            {selesai ? (
              <button
                disabled
                aria-disabled="true"
                className="inline-flex w-[220px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-semibold text-slate-500 cursor-not-allowed"
                title="Subtest ini sudah dikerjakan dan terkunci."
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-6 0V7a3 3 0 1 1 6 0v2h-6Z" />
                </svg>
                Terkunci
              </button>
            ) : (
              <Link
                href={`/tryout/${batchId}/${st.id}`}
                className="inline-flex w-full md:w-[220px] items-center justify-center gap-2 rounded-xl bg-[#EEC0A3] px-4 py-3 text-[15px] font-semibold text-[#4B2F1F] transition-colors duration-200 hover:bg-[#D9A684]"
              >
                Mulai Subtest →
              </Link>
            )}
          </div>
        </div>

        {/* ring halus saat selesai */}
        {selesai && (
          <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-emerald-200/70" />
        )}
      </div>
    );
  };

  const list = useMemo(
    () => subtests.map((st) => <Card key={`${st.batchId}-${st.id}`} st={st} />),
    [subtests, doneMap]
  );

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 justify-items-center mb-28">
      {list}
    </div>
  );
}
