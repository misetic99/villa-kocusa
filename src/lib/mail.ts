import { Resend } from "resend";
import { getRoomById } from "./rooms";
import type { Booking } from "./types";

const DEFAULT_NOTIFY_EMAILS = ["info@villakocusa.com", "villakocusa@gmail.com"];

function getNotifyEmails(): string[] {
  const fromEnv = process.env.BOOKING_NOTIFY_EMAILS;
  if (!fromEnv) return DEFAULT_NOTIFY_EMAILS;
  return fromEnv
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFrom(): string {
  return process.env.MAIL_FROM || "Villa Kocusa <onboarding@resend.dev>";
}

function roomName(roomId: string): string {
  return getRoomById(roomId)?.name.hr ?? roomId;
}

function bookingDetailsHtml(booking: Booking): string {
  return `
    <p><strong>Šifra:</strong> ${booking.code}</p>
    <p><strong>Soba:</strong> ${roomName(booking.roomId)}</p>
    <p><strong>Dolazak:</strong> ${booking.checkIn}</p>
    <p><strong>Odlazak:</strong> ${booking.checkOut}</p>
    <p><strong>Broj gostiju:</strong> ${booking.guests}</p>
    <p><strong>Doručak:</strong> ${booking.breakfast ? "da" : "ne"}</p>
    <p><strong>Ime:</strong> ${booking.name}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Telefon:</strong> ${booking.phone}</p>
    ${booking.message ? `<p><strong>Poruka:</strong> ${booking.message}</p>` : ""}
  `;
}

export async function sendNewBookingNotification(booking: Booking): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY nije postavljen — preskačem slanje obavijesti o novoj rezervaciji.");
    return;
  }

  try {
    const { error } = await client.emails.send({
      from: getFrom(),
      to: getNotifyEmails(),
      subject: `Nova rezervacija na čekanju — ${booking.code}`,
      html: `
        <h2>Nova rezervacija čeka potvrdu</h2>
        ${bookingDetailsHtml(booking)}
        <p>Prijavite se u admin panel kako biste potvrdili ili otkazali rezervaciju.</p>
      `,
    });
    if (error) {
      console.error("Slanje obavijesti o novoj rezervaciji nije uspjelo:", error);
    }
  } catch (error) {
    console.error("Slanje obavijesti o novoj rezervaciji nije uspjelo:", error);
  }
}

export async function sendBookingConfirmedEmail(booking: Booking): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY nije postavljen — preskačem slanje potvrde gostu.");
    return;
  }

  const isEn = booking.lang === "en";

  try {
    const { error } = await client.emails.send({
      from: getFrom(),
      to: [booking.email],
      subject: isEn
        ? `Your reservation is confirmed — ${booking.code}`
        : `Vaša rezervacija je potvrđena — ${booking.code}`,
      html: isEn
        ? `
          <h2>Your reservation is confirmed!</h2>
          <p><strong>Code:</strong> ${booking.code}</p>
          <p><strong>Room:</strong> ${roomName(booking.roomId)}</p>
          <p><strong>Check-in:</strong> ${booking.checkIn}</p>
          <p><strong>Check-out:</strong> ${booking.checkOut}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          ${booking.breakfast ? "<p><strong>Breakfast:</strong> included</p>" : ""}
          ${
            typeof booking.total === "number"
              ? `<p><strong>Total price:</strong> ${booking.total} €</p>`
              : ""
          }
          <p>We look forward to welcoming you!</p>
        `
        : `
          <h2>Vaša rezervacija je potvrđena!</h2>
          <p><strong>Šifra:</strong> ${booking.code}</p>
          <p><strong>Soba:</strong> ${roomName(booking.roomId)}</p>
          <p><strong>Dolazak:</strong> ${booking.checkIn}</p>
          <p><strong>Odlazak:</strong> ${booking.checkOut}</p>
          <p><strong>Broj gostiju:</strong> ${booking.guests}</p>
          ${booking.breakfast ? "<p><strong>Doručak:</strong> uključen</p>" : ""}
          ${
            typeof booking.total === "number"
              ? `<p><strong>Cijena:</strong> ${booking.total} €</p>`
              : ""
          }
          <p>Radujemo se vašem dolasku!</p>
        `,
    });
    if (error) {
      console.error("Slanje potvrde gostu nije uspjelo:", error);
    }
  } catch (error) {
    console.error("Slanje potvrde gostu nije uspjelo:", error);
  }
}
