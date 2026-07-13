import type { Metadata } from "next";
import GalerijaGrid from "@/components/GalerijaGrid";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Pogledajte fotografije Ville Koćuša i njenih soba.",
};

export default function GalerijaPage() {
  return <GalerijaGrid />;
}
