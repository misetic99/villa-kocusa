import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { readBookings } from "@/lib/bookings";

export async function GET(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Neautoriziran pristup." }, { status: 401 });
  }

  const bookings = (await readBookings()).filter((b) => b.status !== "deleted");
  bookings.sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  return NextResponse.json({ bookings });
}
