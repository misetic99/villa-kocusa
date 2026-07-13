import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { cancelBooking } from "@/lib/bookings";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Neautoriziran pristup." }, { status: 401 });
  }

  const { id } = await params;
  const success = await cancelBooking(id);
  if (!success) {
    return NextResponse.json({ error: "Rezervacija nije pronađena." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
