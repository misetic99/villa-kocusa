import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getPricePerNight, getRoomById } from "./rooms";
import { getFullRoomPriceTable } from "./roomPrices";
import { getBreakfastPrice } from "./breakfast";
import type { Booking, CreateBookingInput, UpdateBookingInput } from "./types";
import type { Locale } from "./i18n/dictionary";

const ERRORS = {
  hr: {
    roomNotFound: "Soba nije pronađena.",
    invalidDate: "Neispravan format datuma.",
    pastCheckIn: "Datum dolaska ne može biti u prošlosti.",
    checkoutBeforeCheckin: "Datum odlaska mora biti nakon datuma dolaska.",
    guestRange: (max: number) => `Broj gostiju mora biti između 1 i ${max}.`,
    required: "Ime, email i telefon su obavezni.",
    invalidEmail: "Neispravna email adresa.",
    conflict: "Odabrani termin više nije dostupan. Molimo odaberite druge datume.",
  },
  en: {
    roomNotFound: "Room not found.",
    invalidDate: "Invalid date format.",
    pastCheckIn: "Check-in date cannot be in the past.",
    checkoutBeforeCheckin: "Check-out date must be after check-in date.",
    guestRange: (max: number) => `Number of guests must be between 1 and ${max}.`,
    required: "Name, email, and phone are required.",
    invalidEmail: "Invalid email address.",
    conflict: "The selected dates are no longer available. Please choose different dates.",
  },
} satisfies Record<Locale, unknown>;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf-8");
  }
}

export async function readBookings(): Promise<Booking[]> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: Booking[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(bookings, null, 2) + "\n", "utf-8");
}

function nightsBetween(checkIn: string, checkOut: string): Date[] {
  const nights: Date[] = [];
  let current = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  while (current < end) {
    nights.push(current);
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  return nights;
}

// Computed from the currently configured prices — called at creation and at
// edit time so the stored total reflects what was actually offered then,
// rather than being recalculated (and silently drifting) on every read.
async function computeBookingTotal(
  roomId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  breakfast: boolean
): Promise<{ total: number; breakfastTotal: number }> {
  const nights = nightsBetween(checkIn, checkOut);
  const roomPriceTable = await getFullRoomPriceTable();
  const monthlyPrices = roomPriceTable[roomId] ?? {};

  const roomTotal = nights.reduce((sum, night) => {
    const month = String(night.getMonth() + 1);
    const base = monthlyPrices[month]?.discountedPrice ?? 0;
    return sum + getPricePerNight(base, guests);
  }, 0);

  let breakfastTotal = 0;
  if (breakfast) {
    const { price } = await getBreakfastPrice();
    breakfastTotal = nights.length * guests * price;
  }

  return { total: roomTotal + breakfastTotal, breakfastTotal };
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

// Pending bookings block the calendar just like confirmed ones — the slot is
// reserved from the moment a guest books it, before an admin ever confirms it.
export async function getBookingsForRoom(
  roomId: string
): Promise<Booking[]> {
  const all = await readBookings();
  return all.filter(
    (b) =>
      b.roomId === roomId &&
      (b.status === "pending" || b.status === "confirmed")
  );
}

function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function generateReservationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `VK-${code}`;
}

export type BookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export async function createBooking(
  input: CreateBookingInput
): Promise<BookingResult> {
  const err = ERRORS[input.lang === "en" ? "en" : "hr"];

  const room = getRoomById(input.roomId);
  if (!room) {
    return { ok: false, error: err.roomNotFound };
  }

  if (!isValidDateString(input.checkIn) || !isValidDateString(input.checkOut)) {
    return { ok: false, error: err.invalidDate };
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  if (input.checkIn < todayIso) {
    return { ok: false, error: err.pastCheckIn };
  }

  if (input.checkOut <= input.checkIn) {
    return { ok: false, error: err.checkoutBeforeCheckin };
  }

  if (input.guests < 1 || input.guests > room.capacity) {
    return { ok: false, error: err.guestRange(room.capacity) };
  }

  if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
    return { ok: false, error: err.required };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email.trim())) {
    return { ok: false, error: err.invalidEmail };
  }

  const existing = await getBookingsForRoom(input.roomId);
  const conflict = existing.some((b) =>
    rangesOverlap(input.checkIn, input.checkOut, b.checkIn, b.checkOut)
  );
  if (conflict) {
    return { ok: false, error: err.conflict };
  }

  const breakfast = input.breakfast === true;
  const { total, breakfastTotal } = await computeBookingTotal(
    input.roomId,
    input.checkIn,
    input.checkOut,
    input.guests,
    breakfast
  );

  const booking: Booking = {
    id: randomUUID(),
    code: generateReservationCode(),
    roomId: input.roomId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    message: input.message?.trim() || undefined,
    breakfast,
    total,
    breakfastTotal,
    status: "pending",
    lang: input.lang === "en" ? "en" : "hr",
    createdAt: new Date().toISOString(),
  };

  const all = await readBookings();
  all.push(booking);
  await writeBookings(all);

  return { ok: true, booking };
}

export async function cancelBooking(id: string): Promise<boolean> {
  const all = await readBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  all[idx].status = "cancelled";
  await writeBookings(all);
  return true;
}

export async function confirmBooking(id: string): Promise<Booking | null> {
  const all = await readBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx].status = "confirmed";
  await writeBookings(all);
  return all[idx];
}

// Soft delete: the admin "Obriši" action just marks the record so it drops
// out of the admin list, but the row stays in bookings.json for the record.
export async function deleteBooking(id: string): Promise<boolean> {
  const all = await readBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  all[idx].status = "deleted";
  await writeBookings(all);
  return true;
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
  lang: Locale = "hr"
): Promise<BookingResult> {
  const err = ERRORS[lang];
  const all = await readBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) {
    return { ok: false, error: lang === "en" ? "Booking not found." : "Rezervacija nije pronađena." };
  }

  const current = all[idx];
  const room = getRoomById(current.roomId);
  if (!room) {
    return { ok: false, error: err.roomNotFound };
  }

  const checkIn = input.checkIn ?? current.checkIn;
  const checkOut = input.checkOut ?? current.checkOut;
  const guests = input.guests ?? current.guests;
  const name = (input.name ?? current.name).trim();
  const email = (input.email ?? current.email).trim();
  const phone = (input.phone ?? current.phone).trim();
  const message = input.message !== undefined ? input.message.trim() || undefined : current.message;
  const breakfast = input.breakfast !== undefined ? input.breakfast : current.breakfast;

  if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) {
    return { ok: false, error: err.invalidDate };
  }

  if (checkOut <= checkIn) {
    return { ok: false, error: err.checkoutBeforeCheckin };
  }

  if (guests < 1 || guests > room.capacity) {
    return { ok: false, error: err.guestRange(room.capacity) };
  }

  if (!name || !email || !phone) {
    return { ok: false, error: err.required };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { ok: false, error: err.invalidEmail };
  }

  const conflict = all.some(
    (b) =>
      b.id !== id &&
      b.roomId === current.roomId &&
      (b.status === "pending" || b.status === "confirmed") &&
      rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  );
  if (conflict) {
    return { ok: false, error: err.conflict };
  }

  const { total, breakfastTotal } = await computeBookingTotal(
    current.roomId,
    checkIn,
    checkOut,
    guests,
    breakfast === true
  );

  const updated: Booking = {
    ...current,
    checkIn,
    checkOut,
    guests,
    name,
    email,
    phone,
    message,
    breakfast,
    total,
    breakfastTotal,
  };
  all[idx] = updated;
  await writeBookings(all);

  return { ok: true, booking: updated };
}
