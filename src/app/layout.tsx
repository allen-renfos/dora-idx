import type { Metadata, Viewport } from "next";

import { Lato } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/dashboard.css";
import Providers from "@/provider/QueryClientProvider";
import SocialUrlFetcher from "@/component/SocialUrlFetcher";
import { NameProvider } from "@/component/NameProvider";
import { LayoutShell } from "@/component/sharable/LayoutShell";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../fonts/playfair/Playfair_Display/static/PlayfairDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/playfair/Playfair_Display/static/PlayfairDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/playfair/Playfair_Display/static/PlayfairDisplay-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const arapey = localFont({
  src: [
    {
      path: "../../public/fonts/Arapey/Arapey-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Arapey/Arapey-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-arapey",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashuhomes",
  description: "Ashuhomes",
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
    <html lang="en" className={`${lato.variable} ${playfair.variable} ${arapey.variable}`}>
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
