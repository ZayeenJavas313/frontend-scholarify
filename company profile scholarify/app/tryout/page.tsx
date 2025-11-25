"use client";

import { useRouter } from "next/navigation";
import LayoutTryout from "./components/LayoutTryout";
import HistoryTable from "./components/HistoryTable";
import "./styles/tryout.css";

// Ikon panah & kunci (tanpa lucide-react)
function ArrowRight({ size = 18 }: { size?: number }) {
  const s = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function LockIcon({ size = 18 }: { size?: number }) {
  const s = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Data batch (dummy)
const batchData = [
  {
    id: "batch-1",
    title: "TryOut UTBK Batch 1",
    date: "10 November 2025",
    status: "Tersedia",
    locked: false,
  },
  {
    id: "batch-2",
    title: "TryOut UTBK Batch 2",
    date: "20 November 2025",
    status: "Terkunci",
    locked: true,
  },
  {
    id: "batch-3",
    title: "TryOut UTBK Batch 3",
    date: "30 November 2025",
    status: "Terkunci",
    locked: true,
  },
];

export default function TryoutPage() {
  const router = useRouter();

  return (
    <LayoutTryout>
      {/* ====== Hero Section (harus di dalam LayoutTryout) ====== */}
      <section className="tryout-hero text-center py-12 bg-gradient-to-r from-[#EEC0A3] to-[#D9A684] text-[#4B2F1F] rounded-b-[40px] shadow-md mb-10">
        <p className="hero-tag">Simulasi UTBK Premium</p>
        <h1 className="hero-title">TryOut UTBK 2025 Scholarify</h1>
        <p className="hero-subtitle">
          Latihan terstruktur dengan analitik real-time untuk memaksimalkan potensi dan strategi ujianmu.
        </p>
      </section>

      {/* ====== Section Pilih Batch ====== */}
      <section className="tryout-wrapper">
        <h2 className="tryout-heading">Pilih Batch TryOut</h2>

        <div className="tryout-batch-container">
          {batchData.map((batch) => (
            <div
              key={batch.id}
              className={`batch-card ${batch.locked ? "locked" : "available"}`}
            >
              <div className="batch-content">
                <h3>{batch.title}</h3>
                <p className="batch-date">📅 {batch.date}</p>

                <span
                  className={`status-badge ${
                    batch.locked ? "locked-badge" : "available-badge"
                  }`}
                >
                  {batch.status}
                </span>

                {batch.locked ? (
                  <button className="start-button disabled" disabled>
                    <LockIcon size={18} /> Terkunci
                  </button>
                ) : (
                  <button
                    className="start-button"
                    onClick={() => router.push(`/tryout/${batch.id}`)}
                  >
                    Mulai TryOut <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Section Riwayat & Nilai ====== */}
      <section className="tryout-wrapper pb-28" style={{ paddingTop: 0 }}>
        <h2 className="tryout-subheading" style={{ marginTop: 8 }}>
          Riwayat Pengerjaan & Nilai TryOut
        </h2>

        {/* Komponen tabel riwayat */}
        <HistoryTable />
      </section>
    </LayoutTryout>
  );
}
