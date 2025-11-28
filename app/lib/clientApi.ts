// clientApi.ts - browser-safe API helpers for client components
const API_BASE = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : '/api';

export async function submitJawaban(
  username: string,
  subtestCode: string,
  batchId: string,
  jawaban: Record<string | number, string>,
  durasiDetik?: number
) {
  const jawabanFormatted: Record<string, string> = {};
  Object.entries(jawaban).forEach(([key, jawab]) => {
    jawabanFormatted[String(key)] = String(jawab);
  });

  const res = await fetch(`${API_BASE}/submit-jawaban/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      subtest_code: subtestCode,
      batch_id: batchId,
      jawaban: jawabanFormatted,
      durasi_detik: durasiDetik,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to submit answers: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchRiwayatNilai(username: string) {
  const res = await fetch(`${API_BASE}/riwayat-nilai/${username}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
  return res.json();
}

export default {};
