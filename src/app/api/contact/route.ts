import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/messages";
import type { Locale } from "@/lib/i18n/dictionary";

const ERRORS: Record<Locale, { required: string; invalidEmail: string }> = {
  hr: {
    required: "Ime, email i poruka su obavezni.",
    invalidEmail: "Neispravna email adresa.",
  },
  en: {
    required: "Name, email, and message are required.",
    invalidEmail: "Invalid email address.",
  },
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, email, phone, message, lang } = body;
  const errors = ERRORS[lang === "en" ? "en" : "hr"];

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json({ error: errors.required }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return NextResponse.json({ error: errors.invalidEmail }, { status: 400 });
  }

  const entry = await createMessage({
    name,
    email,
    phone: typeof phone === "string" ? phone : undefined,
    message,
  });

  return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
}
