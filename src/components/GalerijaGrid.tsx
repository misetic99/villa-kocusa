"use client";

import Image from "next/image";
import { rooms } from "@/lib/rooms";
import { villaPhotos } from "@/lib/gallery";
import { useLanguage } from "@/lib/i18n/context";

export default function GalerijaGrid() {
  const { locale, t } = useLanguage();

  const roomPhotos = rooms.flatMap((r) =>
    r.gallery.map((g) => ({ src: g.src, label: `${r.name[locale]} — ${g.label}` }))
  );
  const items = [...villaPhotos, ...roomPhotos];

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="text-center">
        <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
          {t.gallery.kicker}
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          {t.gallery.title}
        </h1>
        <div className="mx-auto mt-4 h-px w-16 gold-rule" />
      </div>

      <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item) => (
          <div
            key={item.src}
            className="relative aspect-square w-full break-inside-avoid overflow-hidden rounded-xl sm:aspect-[4/5]"
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
