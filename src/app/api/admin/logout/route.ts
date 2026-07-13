import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, destroySession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  destroySession(session);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
