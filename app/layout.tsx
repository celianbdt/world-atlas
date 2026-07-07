import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas du Voyageur",
  description: "Carte interactive: monuments, ingrédients, plats et sports du monde entier.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${instrumentSans.variable} ${spaceMono.variable}`}>
      <body className="bg-ink-900 text-linen-200 antialiased">{children}</body>
    </html>
  );
}
