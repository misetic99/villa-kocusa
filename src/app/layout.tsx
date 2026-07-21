import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/context";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});

const defaultTitle = "Villa Koćuša | Sobe uz slap Koćuša, Ljubuški";
const defaultDescription =
  "Villa Koćuša – udobne sobe na slapu Koćuša u blizini Ljubuškog, Bosna i Hercegovina. Provjerite dostupnost i rezervirajte svoj boravak.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s | Villa Koćuša",
  },
  description: defaultDescription,
  keywords: [
    "Villa Koćuša",
    "Vila Koćuša",
    "Kocusa",
    "Villa Kocusa",
    "slap Koćuša",
    "vodopad Koćuša",
    "Kocusa waterfall",
    "smještaj Ljubuški",
    "sobe Ljubuški",
    "noćenje Ljubuški",
    "apartmani Ljubuški",
    "villa Ljubuški",
    "smještaj uz slap",
    "smještaj Hercegovina",
    "smještaj Bosna i Hercegovina",
    "accommodation Ljubuški",
    "rooms Ljubuški Bosnia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE_NAME,
  alternateName: ["Vila Koćuša", "Villa Kocusa", "Vila Kocusa"],
  description: defaultDescription,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
  url: SITE_URL,
  telephone: "+387 63 412 234",
  email: "info@villakocusa.com",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Veljaci 55",
    addressLocality: "Ljubuški",
    postalCode: "88320",
    addressCountry: "BA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hr"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8J7NT7HFFY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8J7NT7HFFY');
          `}
        </Script>
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
