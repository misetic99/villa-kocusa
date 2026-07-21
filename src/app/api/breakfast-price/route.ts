import { NextResponse } from "next/server";
import { getBreakfastPrice } from "@/lib/breakfast";

// Reads data/breakfast-price.json fresh on every request — must not be
// full-route-cached, or admin price edits appear to silently revert.
export const dynamic = "force-dynamic";

export async function GET() {
  const breakfast = await getBreakfastPrice();
  return NextResponse.json(breakfast);
}
