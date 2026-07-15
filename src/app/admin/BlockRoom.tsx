"use client";

import { useState } from "react";
import { rooms, getRoomById } from "@/lib/rooms";
import type { Booking } from "@/lib/types";

export default function BlockRoom({
  blocks,
  pendingActionId,
  onRelease,
  onCreated,
}: {
  blocks: Booking[];
  pendingActionId: string | null;
  onRelease: (id: string) => void;
  onCreated: () => Promise<void>;
}) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError("Odaberite oba datuma.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/bookings/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, checkIn, checkOut, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Blokiranje nije uspjelo.");
        return;
      }
      setCheckIn("");
      setCheckOut("");
      setNote("");
      await onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  return (
    <div className="mt-12 rounded-2xl border border-cream-line bg-white/70 p-6 sm:p-8">
      <h2 className="font-display text-xl text-ink">Zauzeti termini</h2>
      <p className="mt-1 font-sans text-xs text-ink-soft">
        Označite sobu kao zauzetu za termine dogovorene izvan stranice (npr. preko
        Bookinga), pa je automatski nestaje iz kalendara za goste.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:items-end"
      >
        <label className="flex flex-col text-xs text-ink-soft">
          Soba
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 rounded-lg border border-cream-line bg-cream px-2 py-2 text-ink"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.hr}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-ink-soft">
          Od
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 rounded-lg border border-cream-line bg-cream px-2 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col text-xs text-ink-soft">
          Do
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 rounded-lg border border-cream-line bg-cream px-2 py-2 text-ink"
          />
        </label>
        <label className="col-span-2 flex flex-col text-xs text-ink-soft sm:col-span-1">
          Bilješka (opcionalno)
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="npr. Booking.com"
            className="mt-1 rounded-lg border border-cream-line bg-cream px-2 py-2 text-ink"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold px-5 py-2.5 font-sans text-sm text-cream disabled:opacity-40"
        >
          {submitting ? "Blokiranje…" : "Blokiraj"}
        </button>
      </form>

      {error && <p className="mt-3 font-sans text-xs text-red-700">{error}</p>}

      {sortedBlocks.length === 0 ? (
        <p className="mt-6 font-sans text-sm text-ink-soft">
          Trenutno nema ručno blokiranih termina.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-cream-line">
          <table className="w-full min-w-[560px] border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-cream-line bg-cream-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-2">Soba</th>
                <th className="px-4 py-2">Od</th>
                <th className="px-4 py-2">Do</th>
                <th className="px-4 py-2">Bilješka</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {sortedBlocks.map((b) => (
                <tr key={b.id} className="border-b border-cream-line last:border-0">
                  <td className="px-4 py-2">
                    {getRoomById(b.roomId)?.name.hr ?? b.roomId}
                  </td>
                  <td className="px-4 py-2">{b.checkIn}</td>
                  <td className="px-4 py-2">{b.checkOut}</td>
                  <td className="px-4 py-2 text-ink-soft">{b.name}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => onRelease(b.id)}
                      disabled={pendingActionId === b.id}
                      className="text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-40"
                    >
                      Oslobodi
                    </button>
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
