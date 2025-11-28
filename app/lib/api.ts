// API utility untuk komunikasi dengan backend Django

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export interface Subtest {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

export interface Question {
  id: string;
  soal_id?: number; // ID sebenarnya dari database (jika ada)
  subtestId: string;
  question: string;
  question_image?: string; // URL gambar soal (jika ada)
  options: Array<{ key: string; text: string }>;
  answer: string;
  explanation?: string;
}

/**
 * Fetch semua subtests dari backend
 */
export async function fetchSubtests(): Promise<Subtest[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/subtests/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subtests: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subtests:', error);
    throw error;
  }
}

/**
 * Fetch questions untuk subtest tertentu
 */
export async function fetchSubtestQuestions(subtestCode: string): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/subtests/${subtestCode}/questions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    const data = await response.json();
    // Pastikan soal_id ada di setiap question
    return data.map((q: any) => ({
      ...q,
      soal_id: q.soal_id || q.id, // Gunakan soal_id jika ada, fallback ke id
    }));
  } catch (error) {
    console.error(`Error fetching questions for ${subtestCode}:`, error);
    throw error;
  }
}

/**
 * Submit jawaban user untuk suatu subtest
 */
export async function submitJawaban(
  username: string,
  subtestCode: string,
  batchId: string,
  jawaban: Record<string | number, string>,
  durasiDetik?: number
): Promise<{
  success: boolean;
  hasil: {
    id: number;
    subtest_code: string;
    subtest_nama: string;
    batch_id: string;
    jumlah_benar: number;
    jumlah_salah: number;
    jumlah_kosong: number;
    skor: number;
    waktu_selesai: string | null;
  };
}> {
  try {
    // Jawaban sudah dalam format {soal_id: "A"} atau {index: "A"}
    // Backend akan handle mapping jika perlu
    const jawabanFormatted: Record<string, string> = {};
    Object.entries(jawaban).forEach(([key, jawab]) => {
      // Konversi key ke string (bisa soal_id atau index)
      jawabanFormatted[String(key)] = jawab;
    });
    
    console.log("Submitting jawaban formatted:", {
      keys: Object.keys(jawabanFormatted).slice(0, 5),
      count: Object.keys(jawabanFormatted).length,
    });

    const response = await fetch(`${API_BASE_URL}/submit-jawaban/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        subtest_code: subtestCode,
        batch_id: batchId,
        jawaban: jawabanFormatted,
        durasi_detik: durasiDetik,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to submit answers: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
}

/**
 * Fetch riwayat nilai untuk user tertentu
 */
export async function fetchRiwayatNilai(username: string): Promise<Array<{
  id: number;
  batch_id: string;
  subtest_code: string;
  subtest_nama: string;
  jumlah_benar: number;
  jumlah_salah: number;
  jumlah_kosong: number;
  skor: number;
  waktu_selesai: string | null;
  tanggal: string;
}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/riwayat-nilai/${username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}



