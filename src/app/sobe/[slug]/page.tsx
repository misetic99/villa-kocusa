import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { rooms, getRoomBySlug } from "@/lib/rooms";
import RoomDetailClient from "@/components/RoomDetailClient";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return {};

  const title = room.name.hr;
  const description = room.shortDescription.hr;
  const url = `/sobe/${room.slug}`;
  const image = room.gallery[0]?.src ?? DEFAULT_OG_IMAGE.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  return <RoomDetailClient room={room} />;
}
