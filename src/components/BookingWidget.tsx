"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { hr as hrLocale, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/i18n/context";
import { getPricePerNight } from "@/lib/rooms";
import type { MonthlyPrice } from "@/lib/types";

type BookedRange = { checkIn: string; checkOut: string };

// Breakfast is a flat rate that applies to every room (no monthly variation) —
// mirrors src/lib/breakfast.ts DEFAULT_BREAKFAST_PRICE, kept local because
// that module also touches the filesystem and must stay server-only.
const FALLBACK_BREAKFAST_PRICE = 10;

function toIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function isNightBooked(dateIso: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => dateIso >= r.checkIn && dateIso < r.checkOut);
}

export default function BookingWidget({
  roomId,
  roomName,
  capacity,
  pricePerNight,
  roomPrices,
}: {
  roomId: string;
  roomName: string;
  capacity: number;
  pricePerNight: number;
  roomPrices: Record<string, MonthlyPrice> | null;
}) {
  const { locale, t } = useLanguage();
  const dateFnsLocale = locale === "en" ? enUS : hrLocale;
  const monthPattern = locale === "en" ? "LLLL yyyy" : "LLLL yyyy.";

  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [breakfast, setBreakfast] = useState(false);
  const [breakfastPrice, setBreakfastPrice] = useState(FALLBACK_BREAKFAST_PRICE);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    checkIn: string;
    checkOut: string;
    total: number;
    breakfastTotal: number;
  } | null>(null);

  async function loadAvailability() {
    setLoadingAvailability(true);
    try {
      const res = await fetch(
        `/api/availability?roomId=${encodeURIComponent(roomId)}&lang=${locale}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setBookedRanges(data.bookedRanges ?? []);
    } finally {
      setLoadingAvailability(false);
    }
  }

  async function loadBreakfastPrice() {
    try {
      const res = await fetch("/api/breakfast-price", { cache: "no-store" });
      const data = await res.json();
      setBreakfastPrice(typeof data.price === "number" ? data.price : FALLBACK_BREAKFAST_PRICE);
    } catch {
      setBreakfastPrice(FALLBACK_BREAKFAST_PRICE);
    }
  }

  useEffect(() => {
    // Fetch-on-mount to hydrate the calendar; read-only GET with no unmount race.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAvailability();
    loadBreakfastPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, locale]);

  function dayPrice(date: Date): number {
    const month = date.getMonth() + 1;
    const base = roomPrices?.[String(month)]?.discountedPrice ?? pricePerNight;
    return getPricePerNight(base, guests);
  }

  function isDisabledDay(date: Date): boolean {
    if (isBefore(date, today)) return true;
    return isNightBooked(toIso(date), bookedRanges);
  }

  function hasBlockedNightBetween(start: Date, end: Date): boolean {
    const nights = eachDayOfInterval({ start, end: addDays(end, -1) });
    return nights.some((d) => isDisabledDay(d));
  }

  function handleDayClick(date: Date) {
    if (isDisabledDay(date)) return;
    setFormError(null);
    setConfirmation(null);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    if (!isBefore(checkIn, date)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    if (hasBlockedNightBetween(checkIn, date)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    setCheckOut(date);
  }

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const nightsList =
    checkIn && checkOut ? eachDayOfInterval({ start: checkIn, end: addDays(checkOut, -1) }) : [];
  const roomTotal = nightsList.reduce((sum, d) => sum + dayPrice(d), 0);
  const breakfastTotal = breakfast ? nightsList.length * guests * breakfastPrice : 0;
  const total = roomTotal + breakfastTotal;

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function isInSelectedRange(date: Date): boolean {
    if (!checkIn) return false;
    const end = checkOut ?? checkIn;
    return date >= checkIn && date < end;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!checkIn || !checkOut) {
      setFormError(t.booking.errDates);
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError(t.booking.errRequired);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn: toIso(checkIn),
          checkOut: toIso(checkOut),
          guests,
          name,
          email,
          phone,
          message,
          breakfast,
          lang: locale,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? t.booking.errGeneric);
        await loadAvailability();
        return;
      }

      setConfirmation({
        code: data.booking.code,
        checkIn: data.booking.checkIn,
        checkOut: data.booking.checkOut,
        total,
        breakfastTotal,
      });
      setCheckIn(null);
      setCheckOut(null);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setBreakfast(false);
      await loadAvailability();
    } catch {
      setFormError(t.booking.errConn);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-cream-soft p-8 text-center">
        <span className="font-sans text-xs tracking-[0.3em] text-gold-dark">
          {t.booking.confirmedKicker}
        </span>
        <h3 className="mt-3 font-display text-2xl text-ink">
          {t.booking.confirmedTitle}
        </h3>
        <p className="mt-4 font-sans text-sm text-ink-soft">{t.booking.codeLabel}</p>
        <p className="mt-1 font-display text-3xl tracking-widest text-gold">
          {confirmation.code}
        </p>
        <div className="mx-auto mt-6 max-w-xs space-y-1 font-sans text-sm text-ink-soft">
          <p>
            {roomName} · {format(new Date(confirmation.checkIn), "d.M.yyyy.")} –{" "}
            {format(new Date(confirmation.checkOut), "d.M.yyyy.")}
          </p>
          {confirmation.breakfastTotal > 0 && (
            <p>
              {t.booking.breakfastTotal} {confirmation.breakfastTotal} €
            </p>
          )}
          <p className="font-medium text-ink">
            {t.booking.totalLabel} {confirmation.total} €
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmation(null)}
          className="mt-8 rounded-full border border-gold px-6 py-2 font-sans text-sm text-gold hover:bg-gold hover:text-cream"
        >
          {t.booking.newBooking}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cream-line bg-white/70 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          disabled={isSameMonth(viewMonth, today)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-line text-ink-soft disabled:opacity-30"
          aria-label={t.booking.prevMonth}
        >
          ‹
        </button>
        <p className="font-display text-lg capitalize text-ink">
          {format(viewMonth, monthPattern, { locale: dateFnsLocale })}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-line text-ink-soft"
          aria-label={t.booking.nextMonth}
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-sans text-[11px] uppercase tracking-wide text-ink-soft/70">
        {t.booking.weekdays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewMonth);
          const disabled = isDisabledDay(day);
          const isStart = checkIn && isSameDay(day, checkIn);
          const isEnd = checkOut && isSameDay(day, checkOut);
          const inRange = isInSelectedRange(day);
          const highlighted = isStart || isEnd;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled || !inMonth}
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 font-sans text-sm transition-colors ${
                !inMonth ? "invisible" : ""
              } ${
                disabled
                  ? "cursor-not-allowed text-ink-soft/25 line-through"
                  : "text-ink hover:bg-gold-light/40"
              } ${
                highlighted
                  ? "bg-gold text-cream hover:bg-gold"
                  : inRange
                  ? "bg-gold-light/50"
                  : ""
              }`}
            >
              <span>{format(day, "d")}</span>
              {!disabled && (
                <span
                  className={`text-[10px] leading-none ${
                    highlighted ? "text-cream/80" : "text-ink-soft/60"
                  }`}
                >
                  {dayPrice(day)}€
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loadingAvailability && (
        <p className="mt-3 font-sans text-xs text-ink-soft/60">
          {t.booking.loadingAvailability}
        </p>
      )}

      <p className="mt-4 font-sans text-xs text-ink-soft">
        {checkIn && checkOut
          ? `${format(checkIn, "d.M.yyyy.")} – ${format(checkOut, "d.M.yyyy.")} · ${nights} ${
              nights === 1 ? t.booking.night : t.booking.nights
            }`
          : checkIn
          ? t.booking.selectCheckout
          : t.booking.selectCheckin}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="font-sans text-xs text-ink-soft">
            {t.booking.guestsLabel}
          </label>
          <input
            type="number"
            min={1}
            max={capacity}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
          {capacity > 2 && (
            <p className="mt-1 font-sans text-xs text-ink-soft/70">
              {t.rooms.extraGuestNote}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input
            type="checkbox"
            checked={breakfast}
            onChange={(e) => setBreakfast(e.target.checked)}
            className="h-4 w-4 rounded border-cream-line accent-gold"
          />
          {t.booking.breakfastLabel}
          <span className="text-xs text-ink-soft">
            (+{breakfastPrice} € {t.booking.breakfastPerPerson})
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-sans text-xs text-ink-soft">
              {t.booking.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-ink-soft">
              {t.booking.phoneLabel}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-xs text-ink-soft">
            {t.booking.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="font-sans text-xs text-ink-soft">
            {t.booking.messageLabel}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </div>

        {formError && (
          <p className="font-sans text-sm text-red-700">{formError}</p>
        )}

        <div className="flex items-center justify-between border-t border-cream-line pt-4">
          <p className="font-sans text-sm text-ink-soft">
            {breakfastTotal > 0 && (
              <span className="mb-1 block text-xs">
                {t.booking.breakfastTotal} {breakfastTotal} €
              </span>
            )}
            {t.booking.total}
            <span className="ml-2 font-display text-xl text-gold">{total} €</span>
          </p>
          <button
            type="submit"
            disabled={submitting || !checkIn || !checkOut}
            className="rounded-full bg-gold px-6 py-3 font-sans text-sm tracking-wide text-cream transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? t.booking.submitting : t.booking.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
