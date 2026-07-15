import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { createBlock } from "@/lib/bookings";

export async function POST(request: NextRequest) {
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

  const { roomId, checkIn, checkOut, note } = body;

  if (
    typeof roomId !== "string" ||
    typeof checkIn !== "string" ||
    typeof checkOut !== "string"
  ) {
    return NextResponse.json({ error: "Nedostaju obavezni podaci." }, { status: 400 });
  }

  const result = await createBlock({
    roomId,
    checkIn,
    checkOut,
    note: typeof note === "string" ? note : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ booking: result.booking }, { status: 201 });
}
