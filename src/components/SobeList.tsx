"use client";

import { useEffect, useState } from "react";
import { rooms } from "@/lib/rooms";
import RoomCard from "@/components/RoomCard";
import { useLanguage } from "@/lib/i18n/context";
import type { MonthlyPrice } from "@/lib/types";

export default function SobeList() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<Record<string, Record<string, MonthlyPrice>>>({});

  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch("/api/room-prices", { cache: "no-store" });
        const data = await res.json();
        setPrices(data.prices ?? {});
      } catch {
        setPrices({});
      }
    }
    loadPrices();
  }, []);

  const currentMonth = String(new Date().getMonth() + 1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="text-center">
        <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
          {t.rooms.pageKicker}
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          {t.rooms.pageTitle}
        </h1>
        <div className="mx-auto mt-4 h-px w-16 gold-rule" />
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm text-ink-soft sm:text-base">
          {t.rooms.pageSubtitle}
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 sm:max-w-3xl sm:mx-auto">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            price={prices[room.id]?.[currentMonth]?.price}
            discountedPrice={prices[room.id]?.[currentMonth]?.discountedPrice}
          />
        ))}
      </div>
    </div>
  );
}
