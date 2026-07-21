import type { Metadata } from "next";
import GalerijaGrid from "@/components/GalerijaGrid";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const title = "Galerija";
const description = "Pogledajte fotografije Ville Koćuša i njenih soba.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/galerija" },
  openGraph: { title, description, url: "/galerija", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function GalerijaPage() {
  return <GalerijaGrid />;
}
