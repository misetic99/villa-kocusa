"use client";

import type { Room } from "@/lib/types";
import { AmenityIcon, amenityLabel } from "@/components/icons";
import BookingWidget from "@/components/BookingWidget";
import RoomGallery from "@/components/RoomGallery";
import { useLanguage } from "@/lib/i18n/context";

export default function RoomDetailClient({ room }: { room: Room }) {
  const { locale, t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
            {t.rooms.detailKicker}
          </span>
          <h1 className="mt-2 font-display text-4xl text-ink">{room.name[locale]}</h1>
          <p className="mt-2 font-sans text-base text-ink-soft">
            {room.tagline[locale]}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-cream-line py-4 font-sans text-sm text-ink-soft">
            <span>
              {room.capacity} {t.rooms.guests}
            </span>
            <span>{room.bedConfig[locale]}</span>
            <span>
              {room.size} m²
              {room.balconySize ? ` + ${room.balconySize} m² ${t.rooms.balcony}` : ""}
            </span>
            <span className="font-display text-lg text-gold">
              <span className="mr-2 font-sans text-sm text-ink-soft/60 line-through">
                {room.pricePerNight} €
              </span>
              {room.discountedPricePerNight} € {t.rooms.perNight}
            </span>
          </div>

          <div className="mt-8 space-y-4 font-sans text-base leading-relaxed text-ink-soft">
            {room.description[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl text-ink">{t.rooms.amenitiesTitle}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 font-sans text-sm text-ink-soft"
                >
                  <span className="text-gold">
                    <AmenityIcon amenity={amenity} />
                  </span>
                  {amenityLabel(amenity, locale)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <RoomGallery photos={room.gallery} />
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget
            roomId={room.id}
            roomName={room.name[locale]}
            capacity={room.capacity}
            pricePerNight={room.discountedPricePerNight}
          />
        </div>
      </div>
    </div>
  );
}
