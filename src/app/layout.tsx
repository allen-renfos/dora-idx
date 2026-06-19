import type { Metadata, Viewport } from "next";

import { Fraunces, Jost, Marcellus } from "next/font/google";
import "./globals.css";
import "@/styles/dashboard.css";
import Providers from "@/provider/QueryClientProvider";
import SocialUrlFetcher from "@/component/SocialUrlFetcher";
import { NameProvider } from "@/component/NameProvider";
import { LayoutShell } from "@/component/sharable/LayoutShell";

// === Dora · Verdant Atelier type system ===
// Display: Fraunces (soft optical serif). Accent caps: Marcellus (elegant
// Roman). Body/UI: Jost (refined geometric sans). Variable names below are
// aliased to the legacy --font-* names in globals.css so existing references
// pick up the new fonts automatically.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dora — Curated Real Estate",
  description:
    "Dora is a boutique real estate practice pairing distinctive homes with discerning clients across the region's most sought-after addresses.",
  icons: {
    icon: "/logo.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jost.variable} ${marcellus.variable}`}>
      <NameProvider>
        <Providers>
          <SocialUrlFetcher />
          <body className="font-sans antialiased">
            <LayoutShell>{children}</LayoutShell>
          </body>
        </Providers>
      </NameProvider>
    </html>
  );
}
