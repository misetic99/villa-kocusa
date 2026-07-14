import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import { sendNewBookingNotification } from "@/lib/mail";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const { roomId, checkIn, checkOut, guests, name, email, phone, message, breakfast, lang } =
    body;

  if (
    typeof roomId !== "string" ||
    typeof checkIn !== "string" ||
    typeof checkOut !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    (guests !== undefined && typeof guests !== "number" && typeof guests !== "string")
  ) {
    return NextResponse.json(
      {
        error:
          lang === "en" ? "Missing required information." : "Nedostaju obavezni podaci.",
      },
      { status: 400 }
    );
  }

  const result = await createBooking({
    roomId,
    checkIn,
    checkOut,
    guests: Number(guests),
    name,
    email,
    phone,
    message: typeof message === "string" ? message : undefined,
    breakfast: breakfast === true,
    lang: lang === "en" ? "en" : "hr",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  // Best-effort: a failed notification email must not fail the booking itself.
  await sendNewBookingNotification(result.booking);

  return NextResponse.json({ booking: result.booking }, { status: 201 });
}
