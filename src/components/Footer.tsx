"use client";

import Link from "next/link";
import { LogoFull } from "./Logo";
import { useLanguage } from "@/lib/i18n/context";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", label: t.nav.home },
    { href: "/sobe", label: t.nav.rooms },
    { href: "/galerija", label: t.nav.gallery },
    { href: "/kontakt", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-gold/20 bg-night text-cream-soft">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoFull width={200} />
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          <div className="text-center sm:text-left">
            <h3 className="font-display text-lg tracking-wide text-gold-light">
              {t.footer.contactTitle}
            </h3>
            <div className="mx-auto mt-3 h-px w-10 gold-rule sm:mx-0" />
            <ul className="mt-4 space-y-2 font-sans text-sm text-cream-soft/80">
              <li>Veljaci 55</li>
              <li>88320 Ljubuški, Bosna i Hercegovina</li>
              <li>
                <a
                  href="tel:+38763412234"
                  className="hover:text-gold-light"
                >
                  +387 63 412 234
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@villakocusa.com"
                  className="hover:text-gold-light"
                >
                  info@villakocusa.com
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="font-display text-lg tracking-wide text-gold-light">
              {t.footer.quickLinksTitle}
            </h3>
            <div className="mx-auto mt-3 h-px w-10 gold-rule" />
            <ul className="mt-4 space-y-2 font-sans text-sm text-cream-soft/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-right">
            <h3 className="font-display text-lg tracking-wide text-gold-light">
              {t.footer.stayTitle}
            </h3>
            <div className="mx-auto mt-3 h-px w-10 gold-rule sm:ml-auto sm:mr-0" />
            <ul className="mt-4 space-y-2 font-sans text-sm text-cream-soft/80">
              <li>{t.footer.checkIn}</li>
              <li>{t.footer.checkOut}</li>
              <li>{t.footer.wifiParking}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-cream-soft/10 pt-8 text-center font-sans text-xs text-cream-soft/60">
          <p>
            © {year} Villa Koćuša. {t.footer.rights}
          </p>
          <p>
            {t.footer.madeBy}{" "}
            <a
              href="https://itasel.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-soft/80 hover:text-gold-light"
            >
              ITASEL
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
