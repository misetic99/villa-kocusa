import { NextRequest, NextResponse } from "next/server";
import { getRoomById } from "@/lib/rooms";
import { getBookingsForRoom } from "@/lib/bookings";

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId");
  const lang = request.nextUrl.searchParams.get("lang");

  if (!roomId || !getRoomById(roomId)) {
    return NextResponse.json(
      { error: lang === "en" ? "Unknown room." : "Nepoznata soba." },
      { status: 400 }
    );
  }

  const bookings = await getBookingsForRoom(roomId);
  const bookedRanges = bookings.map((b) => ({
    checkIn: b.checkIn,
    checkOut: b.checkOut,
  }));

  return NextResponse.json({ bookedRanges });
}
