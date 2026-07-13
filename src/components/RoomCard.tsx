"use client";

import Image from "next/image";
import Link from "next/link";
import type { Room } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

export default function RoomCard({ room }: { room: Room }) {
  const { locale, t } = useLanguage();
  const cover = room.gallery[0];

  return (
    <Link
      href={`/sobe/${room.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-line bg-white/60 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.label}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-display text-2xl text-ink">{room.name[locale]}</h3>
          <p className="mt-1 font-sans text-sm text-ink-soft">{room.tagline[locale]}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-ink-soft/80">
          <span>
            {room.capacity} {t.rooms.guests}
          </span>
          <span>·</span>
          <span>{room.bedConfig[locale]}</span>
          <span>·</span>
          <span>
            {room.size} m²
            {room.balconySize ? ` + ${room.balconySize} m² ${t.rooms.balcony}` : ""}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-display text-xl text-gold">
            <span className="mr-2 font-sans text-sm text-ink-soft/60 line-through">
              {room.pricePerNight} €
            </span>
            {room.discountedPricePerNight} €
            <span className="font-sans text-xs text-ink-soft"> {t.rooms.perNight}</span>
          </p>
          <span className="font-sans text-sm tracking-wide text-gold underline-offset-4 group-hover:underline">
            {t.rooms.viewDetails}
          </span>
        </div>
      </div>
    </Link>
  );
}
