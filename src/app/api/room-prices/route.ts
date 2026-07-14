import { NextResponse } from "next/server";
import { getFullRoomPriceTable } from "@/lib/roomPrices";

export async function GET() {
  const prices = await getFullRoomPriceTable();
  return NextResponse.json({ prices });
}
