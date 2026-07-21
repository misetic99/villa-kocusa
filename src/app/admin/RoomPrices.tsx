"use client";

import { useEffect, useState } from "react";
import { rooms } from "@/lib/rooms";
import type { MonthlyPrice } from "@/lib/types";

const MONTH_LABELS = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];

type MonthForm = { price: string; discountedPrice: string };

export default function RoomPrices() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [prices, setPrices] = useState<Record<string, Record<string, MonthlyPrice>>>({});
  const [form, setForm] = useState<Record<string, MonthForm>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function loadPrices() {
    setLoading(true);
    try {
      const res = await fetch("/api/room-prices", { cache: "no-store" });
      const data = await res.json();
      setPrices(data.prices ?? {});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrices();
  }, []);

  useEffect(() => {
    const roomPrices = prices[selectedRoomId] ?? {};
    const next: Record<string, MonthForm> = {};
    for (let m = 1; m <= 12; m++) {
      const entry = roomPrices[String(m)] ?? { price: 130, discountedPrice: 95 };
      next[String(m)] = {
        price: String(entry.price),
        discountedPrice: String(entry.discountedPrice),
      };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(next);
    setSaved(false);
  }, [prices, selectedRoomId]);

  function updateField(month: string, field: keyof MonthForm, value: string) {
    setForm((prev) => ({ ...prev, [month]: { ...prev[month], [field]: value } }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      for (let m = 1; m <= 12; m++) {
        const entry = form[String(m)];
        const price = Number(entry.price);
        const discountedPrice = Number(entry.discountedPrice);
        if (
          Number.isNaN(price) ||
          Number.isNaN(discountedPrice) ||
          price < 0 ||
          discountedPrice < 0
        ) {
          setSaveError(`Neispravna cijena za mjesec ${MONTH_LABELS[m - 1]}.`);
          return;
        }
        const res = await fetch("/api/admin/room-prices", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: selectedRoomId, month: m, price, discountedPrice }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setSaveError(data.error ?? "Spremanje nije uspjelo.");
          return;
        }
      }
      await loadPrices();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl text-ink">Cijene soba</h2>
      <p className="mt-1 font-sans text-xs text-ink-soft">
        Cijena po noći, posebno za svaku sobu i svaki mjesec — akcijska cijena je ona koja se
        stvarno naplaćuje gostu (puna se prikazuje precrtano na stranici).
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRoomId(r.id)}
            className={`rounded-full border px-4 py-1.5 font-sans text-xs ${
              selectedRoomId === r.id
                ? "border-gold bg-gold text-cream"
                : "border-cream-line text-ink-soft hover:border-gold hover:text-gold"
            }`}
          >
            {r.name.hr}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 font-sans text-sm text-ink-soft">Učitavanje…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-line">
          <table className="w-full min-w-[480px] border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-cream-line bg-cream-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3">Mjesec</th>
                <th className="px-4 py-3">Puna cijena (€)</th>
                <th className="px-4 py-3">Akcijska cijena (€)</th>
              </tr>
            </thead>
            <tbody>
              {MONTH_LABELS.map((label, i) => {
                const month = String(i + 1);
                const entry = form[month] ?? { price: "130", discountedPrice: "95" };
                return (
                  <tr key={month} className="border-b border-cream-line last:border-0">
                    <td className="px-4 py-2">{label}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={entry.price}
                        onChange={(e) => updateField(month, "price", e.target.value)}
                        className="w-24 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={entry.discountedPrice}
                        onChange={(e) => updateField(month, "discountedPrice", e.target.value)}
                        className="w-24 rounded-lg border border-cream-line bg-white px-2 py-1.5 text-ink"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {saveError && <p className="mt-3 font-sans text-xs text-red-700">{saveError}</p>}
      {saved && !saveError && (
        <p className="mt-3 font-sans text-xs text-emerald-700">Spremljeno.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || loading}
        className="mt-4 rounded-full bg-gold px-6 py-2 font-sans text-sm text-cream disabled:opacity-40"
      >
        {saving ? "Spremanje…" : "Spremi cijene za ovu sobu"}
      </button>
    </div>
  );
}
