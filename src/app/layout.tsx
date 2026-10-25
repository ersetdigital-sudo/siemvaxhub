import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-schibsted",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Siemvaxhub · Top up apa aja, tanpa ribet",
    template: "%s · Siemvaxhub",
  },
  description:
    "Top up pulsa, paket data, e-wallet, token PLN, voucher game, dan bayar tagihan. Online 24 jam.",
};

export const viewport: Viewport = {
  themeColor: "#E9E8CA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${instrument.variable} ${schibsted.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
