import type { Room } from "./types";

function galleryFor(slug: string, count: number): { src: string; label: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/images/${slug}/photo-${String(i + 1).padStart(2, "0")}.jpg`,
    label: `Soba ${slug.split("-")[1]}`,
  }));
}

export const rooms: Room[] = [
  {
    id: "soba-5",
    slug: "soba-5",
    name: { hr: "Soba 5", en: "Room 5" },
    tagline: {
      hr: "Dvokrevetna soba s balkonom",
      en: "Double room with balcony",
    },
    capacity: 2,
    bedConfig: { hr: "Bračni krevet", en: "Double bed" },
    size: 15,
    balconySize: 4,
    pricePerNight: 130,
    discountedPricePerNight: 95,
    shortDescription: {
      hr: "Udobna dvokrevetna soba s bračnim krevetom i vlastitim balkonom od 4 m².",
      en: "A comfortable double room with a double bed and its own 4 m² balcony.",
    },
    description: {
      hr: [
        "Soba 5 prostire se na 15 m² i nudi udoban bračni krevet te vlastiti balkon od 4 m² za jutarnju kavu ili večernji predah.",
        "Idealna je za parove koji traže miran smještaj u sklopu Ville Koćuša, uz klimu, Wi-Fi i TV za opušten boravak.",
      ],
      en: [
        "Room 5 spans 15 m² and offers a comfortable double bed along with its own 4 m² balcony for a morning coffee or an evening rest.",
        "It's ideal for couples looking for a peaceful stay at Villa Koćuša, with AC, Wi-Fi, and TV for a relaxing visit.",
      ],
    },
    amenities: ["wifi", "ac", "tv", "parking", "terrace"],
    gallery: galleryFor("soba-5", 9),
  },
  {
    id: "soba-6",
    slug: "soba-6",
    name: { hr: "Soba 6", en: "Room 6" },
    tagline: {
      hr: "Dvokrevetna soba s balkonom",
      en: "Double room with balcony",
    },
    capacity: 2,
    bedConfig: { hr: "Bračni krevet", en: "Double bed" },
    size: 15,
    balconySize: 4,
    pricePerNight: 130,
    discountedPricePerNight: 95,
    shortDescription: {
      hr: "Udobna dvokrevetna soba s bračnim krevetom i vlastitim balkonom od 4 m².",
      en: "A comfortable double room with a double bed and its own 4 m² balcony.",
    },
    description: {
      hr: [
        "Soba 6 prostire se na 15 m² i nudi udoban bračni krevet te vlastiti balkon od 4 m² za jutarnju kavu ili večernji predah.",
        "Idealna je za parove koji traže miran smještaj u sklopu Ville Koćuša, uz klimu, Wi-Fi i TV za opušten boravak.",
      ],
      en: [
        "Room 6 spans 15 m² and offers a comfortable double bed along with its own 4 m² balcony for a morning coffee or an evening rest.",
        "It's ideal for couples looking for a peaceful stay at Villa Koćuša, with AC, Wi-Fi, and TV for a relaxing visit.",
      ],
    },
    amenities: ["wifi", "ac", "tv", "parking", "terrace"],
    gallery: galleryFor("soba-6", 10),
  },
  {
    id: "soba-7",
    slug: "soba-7",
    name: { hr: "Soba 7", en: "Room 7" },
    tagline: { hr: "Soba za do troje gostiju", en: "Room for up to three guests" },
    capacity: 3,
    bedConfig: {
      hr: "Bračni krevet i dodatni krevet za jednu osobu",
      en: "Double bed and an additional single bed",
    },
    size: 16,
    pricePerNight: 130,
    discountedPricePerNight: 95,
    shortDescription: {
      hr: "Najprostranija soba u vili, s bračnim krevetom i dodatnim krevetom za jednu osobu — pogodna za do troje gostiju.",
      en: "The most spacious room in the villa, with a double bed and an additional single bed — suitable for up to three guests.",
    },
    description: {
      hr: [
        "Soba 7 prostire se na 16 m² i jedina u vili nudi bračni krevet uz dodatni krevet za jednu osobu, pa je pogodna za do troje gostiju.",
        "Savršen izbor za obitelji s djetetom ili troje prijatelja koji putuju zajedno, uz klimu, Wi-Fi i TV za opušten boravak.",
      ],
      en: [
        "Room 7 spans 16 m² and is the only room in the villa with a double bed plus an additional single bed, making it suitable for up to three guests.",
        "A perfect choice for a family with a child or three friends travelling together, with AC, Wi-Fi, and TV for a relaxing stay.",
      ],
    },
    amenities: ["wifi", "ac", "tv", "parking"],
    gallery: galleryFor("soba-7", 7),
  },
  {
    id: "soba-8",
    slug: "soba-8",
    name: { hr: "Soba 8", en: "Room 8" },
    tagline: { hr: "Dvokrevetna soba", en: "Double room" },
    capacity: 2,
    bedConfig: { hr: "Bračni krevet", en: "Double bed" },
    size: 14,
    pricePerNight: 130,
    discountedPricePerNight: 95,
    shortDescription: {
      hr: "Udobna dvokrevetna soba s bračnim krevetom, idealna za dvoje gostiju.",
      en: "A comfortable double room with a double bed, ideal for two guests.",
    },
    description: {
      hr: [
        "Soba 8 prostire se na 14 m² i nudi udoban bračni krevet za dvoje gostiju.",
        "Uz klimu, Wi-Fi i TV, soba pruža sve što je potrebno za opušten odmor u sklopu Ville Koćuša.",
      ],
      en: [
        "Room 8 spans 14 m² and offers a comfortable double bed for two guests.",
        "With AC, Wi-Fi, and TV, the room provides everything needed for a relaxing stay at Villa Koćuša.",
      ],
    },
    amenities: ["wifi", "ac", "tv", "parking"],
    gallery: galleryFor("soba-8", 4),
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
