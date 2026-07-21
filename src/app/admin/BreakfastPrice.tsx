"use client";

import { useEffect, useState } from "react";

export default function BreakfastPrice() {
  const [price, setPrice] = useState("10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function loadPrice() {
    setLoading(true);
    try {
      const res = await fetch("/api/breakfast-price", { cache: "no-store" });
      const data = await res.json();
      setPrice(String(data.price ?? 10));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrice();
  }, []);

  async function handleSave() {
    setSaveError(null);
    setSaved(false);
    const value = Number(price);
    if (Number.isNaN(value) || value < 0) {
      setSaveError("Neispravna cijena.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/breakfast-price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error ?? "Spremanje nije uspjelo.");
        return;
      }
      setPrice(String(data.price));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl text-ink">Cijena doručka</h2>
      <p className="mt-1 font-sans text-xs text-ink-soft">
        Jedna cijena po osobi/noći, vrijedi za sve sobe.
      </p>

      {loading ? (
        <p className="mt-6 font-sans text-sm text-ink-soft">Učitavanje…</p>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            min={0}
            step="0.5"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setSaved(false);
            }}
            className="w-32 rounded-lg border border-cream-line bg-white px-3 py-2 font-sans text-sm text-ink"
          />
          <span className="font-sans text-sm text-ink-soft">€ po osobi/noći</span>
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
        {saving ? "Spremanje…" : "Spremi cijenu doručka"}
      </button>
    </div>
  );
}
