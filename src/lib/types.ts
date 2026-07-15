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

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "deleted" | "blocked";

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
  breakfast?: boolean;
  // Locked in at creation/edit time from the then-current prices, so later
  // admin price changes never retroactively alter an existing booking.
  // Optional because bookings created before this field existed lack it.
  total?: number;
  breakfastTotal?: number;
  status: BookingStatus;
  lang?: "hr" | "en";
  createdAt: string;
};

export type UpdateBookingInput = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  breakfast?: boolean;
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
  breakfast?: boolean;
  lang?: "hr" | "en";
};

// Admin-configurable accommodation price, per room, per calendar month (1-12).
// discountedPrice is the rate actually charged, matching how the site has
// always shown a crossed-out full price next to the active discounted one.
export type MonthlyPrice = {
  price: number;
  discountedPrice: number;
};

export type RoomPriceSettings = Record<string, Record<string, MonthlyPrice>>;

// Breakfast is a single flat rate that applies to every room, no monthly variation.
export type BreakfastPrice = {
  price: number;
};
