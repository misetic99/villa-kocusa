import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { confirmBooking } from "@/lib/bookings";
import { sendBookingConfirmedEmail } from "@/lib/mail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Neautoriziran pristup." }, { status: 401 });
  }

  const { id } = await params;
  const booking = await confirmBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Rezervacija nije pronađena." }, { status: 404 });
  }

  await sendBookingConfirmedEmail(booking);

  return NextResponse.json({ ok: true, booking });
}
