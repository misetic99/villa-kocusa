# Villa Koćuša

Web stranica i sustav rezervacija za Villu Koćuša — Next.js 16 (App Router) + TypeScript + Tailwind CSS 4.

## Pokretanje

```bash
npm install
npm run dev
```

Otvorite [http://localhost:3000](http://localhost:3000).

## Sadržaj

- **Naslovnica, Apartmani, Galerija, Kontakt** — javne stranice s logom, opisima i placeholder galerijom (do dodavanja stvarnih fotografija).
- **Rezervacije** (`/apartmani/[slug]`) — kalendar dostupnosti koji provjerava postojeće rezervacije i sprječava dvostruko bukiranje. Rezervacije se spremaju u `data/bookings.json`.
- **Kontakt forma** — poruke se spremaju u `data/messages.json`.
- **Admin panel** (`/admin`) — pregled i otkazivanje rezervacija, zaštićeno lozinkom.

## Admin pristup

Lozinka za `/admin` postavlja se preko `ADMIN_PASSWORD` env varijable (vidi `.env.example`). Zadana lozinka za razvoj: `kocusa2026` — **obavezno promijeniti prije objave na produkciji**.

```bash
cp .env.example .env.local
```

## Podaci o apartmanima i sadržaj

Placeholder tekstovi, cijene i kontakt podaci (adresa, telefon, email) nalaze se u:

- `src/lib/apartments.ts` — apartmani, cijene, opisi, sadržaji
- `src/components/Footer.tsx` i `src/app/kontakt/page.tsx` — kontakt podaci

Prilagodite ih stvarnim podacima prije objave.

## Logo

Logo (`Downloads/villa_kocusa_logo.png`) parsiran je u SVG komponentu `src/components/Logo.tsx` (monogram za header/favicon, puni logotip za footer), a favicon/apple-icon generiraju se skriptom `scripts/generate-icons.mjs`.
