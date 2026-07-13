import type { Metadata } from "next";
import SobeList from "@/components/SobeList";

export const metadata: Metadata = {
  title: "Sobe",
  description:
    "Pregledajte sve sobe Ville Koćuša i rezervirajte svoj termin uz trenutnu provjeru dostupnosti.",
};

export default function SobePage() {
  return <SobeList />;
}
