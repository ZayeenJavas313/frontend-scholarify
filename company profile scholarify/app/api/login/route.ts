import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username & password wajib" }, { status: 400 });
    }

    // Panggil backend Django untuk validasi credensial
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

    const backendRes = await fetch(`${baseUrl}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok || !data?.ok || !data?.user) {
      const msg = data?.error || "Username atau password salah";
      return NextResponse.json({ error: msg }, { status: backendRes.status || 401 });
    }

    const payload = {
      username: data.user.username as string,
      name: (data.user.name as string) ?? data.user.username,
      role: (data.user.role as string) ?? "student",
    };

    const res = NextResponse.json({ ok: true, user: payload });
    // Secure cookie di production (HTTPS), false di development
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookies.set("session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,    // true di production (HTTPS), false di development
      path: "/",
      maxAge: 60 * 60 * 8,     // 8 jam
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
