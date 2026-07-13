import type { Metadata } from "next";
import KontaktClient from "@/components/KontaktClient";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte Villu Koćuša za dodatne informacije, upite ili posebne zahtjeve.",
};

export default function KontaktPage() {
  return <KontaktClient />;
}
