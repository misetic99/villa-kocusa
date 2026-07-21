import { NextResponse } from "next/server";
import { getFullRoomPriceTable } from "@/lib/roomPrices";

// Reads data/room-prices.json fresh on every request — must not be
// full-route-cached, or admin price edits appear to silently revert.
export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await getFullRoomPriceTable();
  return NextResponse.json({ prices });
}
