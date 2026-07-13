"use client";

import { useEffect, useState } from "react";
import { getRoomById } from "@/lib/rooms";
import type { Booking } from "@/lib/types";

export default function AdminPage() {
  const [status, setStatus] = useState<"checking" | "guest" | "authed">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadBookings() {
    const res = await fetch("/api/admin/bookings");
    if (res.status === 401) {
      setStatus("guest");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setStatus("authed");
  }

  useEffect(() => {
    // Fetch-on-mount to check the session and hydrate the bookings table.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error ?? "Pogrešna lozinka.");
      return;
    }
    setPassword("");
    await loadBookings();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("guest");
    setBookings([]);
  }

  async function handleCancel(id: string) {
    setCancellingId(id);
    try {
      await fetch(`/api/admin/bookings/${id}/cancel`, { method: "POST" });
      await loadBookings();
    } finally {
      setCancellingId(null);
    }
  }

  if (status === "checking") {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center font-sans text-sm text-ink-soft">
        Učitavanje…
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <h1 className="text-center font-display text-3xl text-ink">
          Admin prijava
        </h1>
        <form
          onSubmit={handleLogin}
          className="mt-8 rounded-2xl border border-cream-line bg-white/70 p-6"
        >
          <label className="font-sans text-xs text-ink-soft">Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
          {loginError && (
            <p className="mt-3 font-sans text-sm text-red-700">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gold px-6 py-3 font-sans text-sm tracking-wide text-cream hover:scale-[1.02]"
          >
            Prijavi se
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Rezervacije</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-cream-line px-4 py-2 font-sans text-xs text-ink-soft hover:border-gold hover:text-gold"
        >
          Odjava
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-10 font-sans text-sm text-ink-soft">
          Trenutno nema rezervacija.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-cream-line">
          <table className="w-full min-w-[720px] border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-cream-line bg-cream-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3">Šifra</th>
                <th className="px-4 py-3">Soba</th>
                <th className="px-4 py-3">Dolazak</th>
                <th className="px-4 py-3">Odlazak</th>
                <th className="px-4 py-3">Gost</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-line last:border-0">
                  <td className="px-4 py-3 font-medium text-gold">{b.code}</td>
                  <td className="px-4 py-3">
                    {getRoomById(b.roomId)?.name.hr ?? b.roomId}
                  </td>
                  <td className="px-4 py-3">{b.checkIn}</td>
                  <td className="px-4 py-3">{b.checkOut}</td>
                  <td className="px-4 py-3">
                    {b.name}
                    <span className="block text-xs text-ink-soft/70">
                      {b.guests} gostiju
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft">
                    {b.email}
                    <br />
                    {b.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        b.status === "confirmed"
                          ? "bg-gold-light/50 text-gold-dark"
                          : "bg-cream-line text-ink-soft"
                      }`}
                    >
                      {b.status === "confirmed" ? "potvrđeno" : "otkazano"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
                      >
                        Otkaži
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
