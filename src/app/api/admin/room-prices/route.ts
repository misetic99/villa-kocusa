import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { getFullRoomPriceTable, setRoomPrice } from "@/lib/roomPrices";
import { getRoomById } from "@/lib/rooms";

export async function PUT(request: NextRequest) {
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

  const { roomId, month, price, discountedPrice } = body;

  if (
    typeof roomId !== "string" ||
    !getRoomById(roomId) ||
    typeof month !== "number" ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    typeof price !== "number" ||
    Number.isNaN(price) ||
    price < 0 ||
    typeof discountedPrice !== "number" ||
    Number.isNaN(discountedPrice) ||
    discountedPrice < 0
  ) {
    return NextResponse.json({ error: "Neispravni podaci o cijeni." }, { status: 400 });
  }

  await setRoomPrice(roomId, month, price, discountedPrice);
  const prices = await getFullRoomPriceTable();

  return NextResponse.json({ prices });
}
