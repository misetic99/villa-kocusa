"use client";

import ContactForm from "@/components/ContactForm";
import { useLanguage } from "@/lib/i18n/context";

export default function KontaktClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <div className="text-center">
        <span className="font-sans text-xs tracking-[0.35em] text-gold-dark">
          {t.kontakt.kicker}
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          {t.kontakt.title}
        </h1>
        <div className="mx-auto mt-4 h-px w-16 gold-rule" />
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm text-ink-soft sm:text-base">
          {t.kontakt.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl text-ink">{t.kontakt.addressTitle}</h2>
            <p className="mt-2 font-sans text-sm text-ink-soft">
              Veljaci 55
              <br />
              88320 Ljubuški, Bosna i Hercegovina
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">{t.kontakt.phoneTitle}</h2>
            <p className="mt-2 font-sans text-sm text-ink-soft">
              <a href="tel:+38763412234" className="hover:text-gold">
                +387 63 412 234
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">{t.kontakt.emailTitle}</h2>
            <p className="mt-2 font-sans text-sm text-ink-soft">
              <a href="mailto:info@villakocusa.hr" className="hover:text-gold">
                info@villakocusa.hr
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">{t.kontakt.checkTitle}</h2>
            <p className="mt-2 font-sans text-sm text-ink-soft">{t.kontakt.checkText}</p>
          </div>
        </div>

        <ContactForm />
      </div>

      <div className="mt-14">
        <h2 className="text-center font-display text-xl text-ink">
          {t.kontakt.mapTitle}
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-cream-line">
          <iframe
            title="Villa Koćuša – lokacija"
            src="https://www.google.com/maps?q=43.2488226,17.4508123&z=16&output=embed"
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-3 text-center font-sans text-sm">
          <a
            href="https://maps.app.goo.gl/7inzTyn1QEuF7VNk7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            {t.kontakt.mapOpenLink}
          </a>
        </p>
      </div>
    </div>
  );
}
