"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "./Logo";
import { useLanguage } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/dictionary";

function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`flex items-center rounded-full border border-cream-line p-0.5 font-sans text-xs tracking-wide ${className}`}
    >
      {(["hr", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`rounded-full px-3 py-1 uppercase transition-colors ${
            locale === l
              ? "bg-gold text-cream"
              : "text-ink-soft hover:text-gold"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/sobe", label: t.nav.rooms },
    { href: "/galerija", label: t.nav.gallery },
    { href: "/kontakt", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cream-line/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <LogoMark size={42} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-wide text-ink">
              Villa Koćuša
            </span>
            <span className="font-sans text-[10px] tracking-[0.3em] text-gold-dark">
              {t.header.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm tracking-wide transition-colors ${
                  active
                    ? "text-gold"
                    : "text-ink-soft hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <LanguageToggle />
          <Link
            href="/sobe"
            className="rounded-full border border-gold px-5 py-2 font-sans text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            {t.header.bookNow}
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-line text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {open ? (
                <path
                  d="M2 2L16 16M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M1 4H17M1 9H17M1 14H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream-line bg-cream px-5 pb-5 pt-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 font-sans text-sm text-ink-soft hover:bg-cream-soft hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sobe"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full border border-gold px-5 py-3 text-center font-sans text-sm tracking-wide text-gold"
          >
            {t.header.bookNow}
          </Link>
        </nav>
      )}
    </header>
  );
}
