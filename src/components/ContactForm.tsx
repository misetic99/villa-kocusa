"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function ContactForm() {
  const { locale, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, lang: locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.contactForm.genericError);
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError(t.contactForm.connError);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-cream-soft p-8 text-center">
        <h3 className="font-display text-2xl text-ink">{t.contactForm.sentTitle}</h3>
        <p className="mt-3 font-sans text-sm text-ink-soft">{t.contactForm.sentText}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-gold px-6 py-2 font-sans text-sm text-gold hover:bg-gold hover:text-cream"
        >
          {t.contactForm.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream-line bg-white/70 p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-sans text-xs text-ink-soft">{t.contactForm.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="font-sans text-xs text-ink-soft">
            {t.contactForm.phoneOptional}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="font-sans text-xs text-ink-soft">{t.contactForm.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </div>

      <div className="mt-4">
        <label className="font-sans text-xs text-ink-soft">{t.contactForm.message}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="mt-1 w-full rounded-lg border border-cream-line bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </div>

      {error && <p className="mt-4 font-sans text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-gold px-6 py-3 font-sans text-sm tracking-wide text-cream transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {submitting ? t.contactForm.submitting : t.contactForm.submit}
      </button>
    </form>
  );
}
