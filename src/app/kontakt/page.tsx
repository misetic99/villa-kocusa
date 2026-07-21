import type { Metadata } from "next";
import KontaktClient from "@/components/KontaktClient";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const title = "Kontakt";
const description =
  "Kontaktirajte Villu Koćuša za dodatne informacije, upite ili posebne zahtjeve.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kontakt" },
  openGraph: { title, description, url: "/kontakt", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function KontaktPage() {
  return <KontaktClient />;
}
