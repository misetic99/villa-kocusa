import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSession,
  isLoginRateLimited,
  recordFailedLogin,
} from "@/lib/adminAuth";

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  if (isLoginRateLimited(key)) {
    return NextResponse.json(
      { error: "Previše pokušaja prijave. Pokušajte ponovno za 15 minuta." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    recordFailedLogin(key);
    return NextResponse.json({ error: "Pogrešna lozinka." }, { status: 401 });
  }

  const session = createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
