import type { Metadata } from "next";
import SobeList from "@/components/SobeList";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const title = "Sobe";
const description =
  "Pregledajte sve sobe Ville Koćuša i rezervirajte svoj termin uz trenutnu provjeru dostupnosti.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sobe" },
  openGraph: { title, description, url: "/sobe", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function SobePage() {
  return <SobeList />;
}
