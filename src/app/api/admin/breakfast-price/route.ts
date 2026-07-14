import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { getBreakfastPrice, setBreakfastPrice } from "@/lib/breakfast";

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

  const { price } = body;

  if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Neispravna cijena." }, { status: 400 });
  }

  await setBreakfastPrice(price);
  const breakfast = await getBreakfastPrice();

  return NextResponse.json(breakfast);
}
