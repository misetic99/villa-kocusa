import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { deleteBooking, updateBooking } from "@/lib/bookings";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Neautoriziran pristup." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const { id } = await params;
  const { checkIn, checkOut, guests, name, email, phone, message, breakfast } = body;

  const result = await updateBooking(id, {
    checkIn: typeof checkIn === "string" ? checkIn : undefined,
    checkOut: typeof checkOut === "string" ? checkOut : undefined,
    guests:
      guests !== undefined && guests !== "" ? Number(guests) : undefined,
    name: typeof name === "string" ? name : undefined,
    email: typeof email === "string" ? email : undefined,
    phone: typeof phone === "string" ? phone : undefined,
    message: typeof message === "string" ? message : undefined,
    breakfast: typeof breakfast === "boolean" ? breakfast : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ booking: result.booking });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Neautoriziran pristup." }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteBooking(id);
  if (!success) {
    return NextResponse.json({ error: "Rezervacija nije pronađena." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
