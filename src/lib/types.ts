import type { LocalizedText } from "./i18n/dictionary";

export type AmenityKey =
  | "wifi"
  | "parking"
  | "ac"
  | "sea-view"
  | "kitchen"
  | "terrace"
  | "washer"
  | "pets"
  | "tv"
  | "safe";

export type Room = {
  id: string;
  slug: string;
  name: LocalizedText;
  tagline: LocalizedText;
  capacity: number;
  bedConfig: LocalizedText;
  size: number;
  balconySize?: number;
  pricePerNight: number;
  discountedPricePerNight: number;
  shortDescription: LocalizedText;
  description: { hr: string[]; en: string[] };
  amenities: AmenityKey[];
  gallery: { src: string; label: string }[];
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  code: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  lang?: "hr" | "en";
};
