"use client";

import Image from "next/image";
import Link from "next/link";
import { rooms } from "@/lib/rooms";
import { heroPhoto } from "@/lib/gallery";
import { AmenityIcon, amenityLabel } from "@/components/icons";
import RoomCard from "@/components/RoomCard";
import type { AmenityKey } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

const HIGHLIGHT_AMENITIES: AmenityKey[] = ["wifi", "ac", "tv", "parking", "terrace"];

export default function Home() {
  const { locale, t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-cream">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.label}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: "center 30%" }}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/40" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-28 text-center sm:py-36">
          <span className="font-sans text-xs tracking-[0.4em] text-gold-light">
            {t.home.heroKicker}
          </span>
          <h1 className="mt-4 font-display text-5xl tracking-wide text-gold-gradient sm:text-6xl">
            Villa Koćuša
          </h1>
          <div className="mt-4 h-px w-24 gold-rule" />
          <p className="mt-6 max-w-xl font-sans text-base text-cream-soft/90 sm:text-lg">
            {t.home.heroText}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/sobe"
              className="rounded-full bg-gold px-8 py-3 font-sans text-sm tracking-wide text-night transition-transform hover:scale-[1.03]"
            >
              {t.home.heroCta}
            </Link>
            <Link
              href="/kontakt"
              className="rounded-full border border-cream-soft/40 px-8 py-3 font-sans text-sm tracking-wide text-cream-soft transition-colors hover:border-gold-light hover:text-gold-light"
            >
              {t.home.heroContact}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
        <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
          {t.home.aboutKicker}
        </span>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          {t.home.aboutTitle}
        </h2>
        <div className="mx-auto mt-4 h-px w-16 gold-rule" />
        <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-ink-soft">
          {t.home.aboutText}
        </p>
      </section>

      {/* Rooms preview */}
      <section className="bg-cream-soft/60 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
              {t.home.roomsKicker}
            </span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {t.home.roomsTitle}
            </h2>
            <div className="mx-auto mt-4 h-px w-16 gold-rule" />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:max-w-3xl sm:mx-auto">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
            {t.home.amenitiesKicker}
          </span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            {t.home.amenitiesTitle}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 gold-rule" />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
          {HIGHLIGHT_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
                <AmenityIcon amenity={amenity} />
              </span>
              <span className="font-sans text-xs text-ink-soft">
                {amenityLabel(amenity, locale)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-night py-20 text-center text-cream">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-3xl text-gold-gradient sm:text-4xl">
            {t.home.ctaTitle}
          </h2>
          <p className="mt-4 font-sans text-sm text-cream-soft/80 sm:text-base">
            {t.home.ctaText}
          </p>
          <Link
            href="/sobe"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-3 font-sans text-sm tracking-wide text-night transition-transform hover:scale-[1.03]"
          >
            {t.home.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
