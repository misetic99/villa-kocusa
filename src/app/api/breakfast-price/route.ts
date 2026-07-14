import { NextResponse } from "next/server";
import { getBreakfastPrice } from "@/lib/breakfast";

export async function GET() {
  const breakfast = await getBreakfastPrice();
  return NextResponse.json(breakfast);
}
