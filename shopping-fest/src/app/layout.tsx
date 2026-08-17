import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

/*
 * The original loaded Inter from fonts.googleapis.com. next/font self-hosts it,
 * removing the third-party request while keeping the same family.
 *
 * Funnel Display stays a plain @font-face in globals.css: it is a single static
 * weight served from /public, so next/font would add no value.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shopping Fest 2026 – Hay cosas que solo se viven en persona",
  description:
    "Shopping Fest es un evento nacional que celebra el encuentro y el placer de salir a compartir. Tres días de actividades, sorpresas y descuentos en los centros comerciales de todo el país.",
  icons: {
    icon: [
      { url: "/images/cropped-logotipo-32x32.png", sizes: "32x32" },
      { url: "/images/cropped-logotipo-192x192.png", sizes: "192x192" },
    ],
    apple: "/images/cropped-logotipo-180x180.png",
  },
  robots: { "max-image-preview": "large" },
};

/* `viewport-fit=cover` carried over from the original meta tag. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <GoogleTagManager />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
