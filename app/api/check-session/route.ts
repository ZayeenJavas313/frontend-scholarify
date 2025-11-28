import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;

  if (!raw) {
    // belum login
    return NextResponse.json({ ok: false });
  }

  try {
    const session = JSON.parse(raw) as {
      username: string;
      name: string;
      role?: string;
    };

    // sekarang API juga mengirim user
    return NextResponse.json({ ok: true, user: session });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
