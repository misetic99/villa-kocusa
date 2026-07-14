"use client";

import { Fragment, useEffect, useState } from "react";
import { getRoomById } from "@/lib/rooms";
import type { Booking } from "@/lib/types";
import RoomPrices from "./RoomPrices";
import BreakfastPrice from "./BreakfastPrice";

type EditForm = {
  checkIn: string;
  checkOut: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  breakfast: boolean;
};

const STATUS_LABELS: Record<Booking["status"], string> = {
  pending: "na čekanju",
  confirmed: "potvrđeno",
  cancelled: "otkazano",
  deleted: "obrisano",
};

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-gold-light/50 text-gold-dark",
  cancelled: "bg-cream-line text-ink-soft",
  deleted: "bg-cream-line text-ink-soft",
};

export default function AdminPage() {
  const [status, setStatus] = useState<"checking" | "guest" | "authed">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

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
    setPendingActionId(id);
    try {
      await fetch(`/api/admin/bookings/${id}/cancel`, { method: "POST" });
      await loadBookings();
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleConfirm(id: string) {
    setPendingActionId(id);
    try {
      await fetch(`/api/admin/bookings/${id}/confirm`, { method: "POST" });
      await loadBookings();
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Sigurno želite obrisati ovu rezervaciju s popisa?")) {
      return;
    }
    setPendingActionId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      await loadBookings();
    } finally {
      setPendingActionId(null);
    }
  }

  function startEdit(b: Booking) {
    setEditingId(b.id);
    setEditError(null);
    setEditForm({
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests: String(b.guests),
      name: b.name,
      email: b.email,
      phone: b.phone,
      message: b.message ?? "",
      breakfast: b.breakfast ?? false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setEditError(null);
  }

  async function saveEdit(id: string) {
    if (!editForm) return;
    setEditError(null);
    setPendingActionId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEditError(data.error ?? "Spremanje nije uspjelo.");
        return;
      }
      cancelEdit();
      await loadBookings();
    } finally {
      setPendingActionId(null);
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
          <table className="w-full min-w-[820px] border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-cream-line bg-cream-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3">Šifra</th>
                <th className="px-4 py-3">Soba</th>
                <th className="px-4 py-3">Dolazak</th>
                <th className="px-4 py-3">Odlazak</th>
                <th className="px-4 py-3">Gost</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Doručak</th>
                <th className="px-4 py-3">Cijena</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <Fragment key={b.id}>
                  <tr className="border-b border-cream-line last:border-0">
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
                    <td className="px-4 py-3 text-xs text-ink-soft">
                      {b.breakfast ? "Da" : "Ne"}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft">
                      {typeof b.total === "number" ? `${b.total} €` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${STATUS_STYLES[b.status]}`}
                      >
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {b.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(b.id)}
                            disabled={pendingActionId === b.id}
                            className="text-xs text-emerald-700 underline-offset-2 hover:underline disabled:opacity-40"
                          >
                            Potvrdi
                          </button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button
                            type="button"
                            onClick={() => handleCancel(b.id)}
                            disabled={pendingActionId === b.id}
                            className="text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
                          >
                            Otkaži
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            editingId === b.id ? cancelEdit() : startEdit(b)
                          }
                          className="text-xs text-ink-soft underline-offset-2 hover:underline"
                        >
                          {editingId === b.id ? "Zatvori" : "Uredi"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id)}
                          disabled={pendingActionId === b.id}
                          className="text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === b.id && editForm && (
                    <tr className="border-b border-cream-line bg-cream-soft/60">
                      <td colSpan={10} className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <label className="flex flex-col text-xs text-ink-soft">
                            Dolazak
                            <input
                              type="date"
                              value={editForm.checkIn}
                              onChange={(e) =>
                                setEditForm({ ...editForm, checkIn: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="flex flex-col text-xs text-ink-soft">
                            Odlazak
                            <input
                              type="date"
                              value={editForm.checkOut}
                              onChange={(e) =>
                                setEditForm({ ...editForm, checkOut: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="flex flex-col text-xs text-ink-soft">
                            Broj gostiju
                            <input
                              type="number"
                              min={1}
                              value={editForm.guests}
                              onChange={(e) =>
                                setEditForm({ ...editForm, guests: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="flex flex-col text-xs text-ink-soft">
                            Ime
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="flex flex-col text-xs text-ink-soft">
                            Email
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({ ...editForm, email: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="flex flex-col text-xs text-ink-soft">
                            Telefon
                            <input
                              type="text"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({ ...editForm, phone: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                            />
                          </label>
                          <label className="col-span-2 flex flex-col text-xs text-ink-soft sm:col-span-4">
                            Poruka
                            <textarea
                              value={editForm.message}
                              onChange={(e) =>
                                setEditForm({ ...editForm, message: e.target.value })
                              }
                              className="mt-1 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                              rows={2}
                            />
                          </label>
                          <label className="col-span-2 flex items-center gap-2 text-xs text-ink-soft sm:col-span-4">
                            <input
                              type="checkbox"
                              checked={editForm.breakfast}
                              onChange={(e) =>
                                setEditForm({ ...editForm, breakfast: e.target.checked })
                              }
                              className="h-4 w-4 rounded border-cream-line accent-gold"
                            />
                            Doručak
                          </label>
                        </div>
                        {editError && (
                          <p className="mt-3 font-sans text-xs text-red-700">{editError}</p>
                        )}
                        <div className="mt-3 flex gap-3">
                          <button
                            type="button"
                            onClick={() => saveEdit(b.id)}
                            disabled={pendingActionId === b.id}
                            className="rounded-full bg-gold px-4 py-1.5 text-xs text-cream disabled:opacity-40"
                          >
                            Spremi
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-full border border-cream-line px-4 py-1.5 text-xs text-ink-soft"
                          >
                            Odustani
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoomPrices />
      <BreakfastPrice />
    </div>
  );
}
