import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleTagManager } from "@next/third-parties/google";
import { clerkEsLocalization } from "@/lib/auth/clerk-localization";
import "./globals.css";
import { TitleRotator } from "@/components/shared/title-rotator";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";

/**
 * Clerk is only mounted when it's the active provider. In mock mode the app
 * runs with no Clerk keys and no Clerk runtime — the public site pays nothing.
 */
const clerkOn = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";

/**
 * CASC's Google Tag Manager container. Loaded only in production builds so
 * local development doesn't pollute their analytics. The allowed GTM/GA
 * origins live in the CSP (next.config.ts).
 */
const GTM_ID = "GTM-MLBPTTSW";
const gtmOn = process.env.NODE_ENV === "production";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

/** Public site origin. Env override for previews; production default. */
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://casc.org.ar";

export const metadata: Metadata = {
  // Resolves relative OG/canonical URLs against the real domain.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cámara Argentina de Shopping Centers",
    template: "%s — CASC",
  },
  description:
    "La Cámara Argentina de Shopping Centers (CASC) representa a los centros comerciales, retailers y proveedores del país. Más de 35 años acompañando a la industria.",
  applicationName: "CASC",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Cámara Argentina de Shopping Centers",
    url: siteUrl,
    title: "Cámara Argentina de Shopping Centers",
    description:
      "Representamos a los centros comerciales, retailers y proveedores de la Argentina.",
    images: [
      {
        url: "/assets/banners/banner-1-1.webp",
        width: 1920,
        height: 700,
        alt: "Cámara Argentina de Shopping Centers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cámara Argentina de Shopping Centers",
    description:
      "Representamos a los centros comerciales, retailers y proveedores de la Argentina.",
    images: ["/assets/banners/banner-1-1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = (
    <html lang="es" className={`${inter.variable} h-full`}>
      {gtmOn && <GoogleTagManager gtmId={GTM_ID} />}
      {/* Browser extensions (ColorZilla, password managers) inject attributes
          on <body> before hydration; suppress the mismatch on this node only. */}
      {/* overflow-x-hidden: safety net so a stray wide element can't cause
          accidental horizontal scroll on mobile. */}
      <body className="min-h-full overflow-x-hidden" suppressHydrationWarning>
        {/* GTM fallback for visitors with JavaScript disabled. */}
        {gtmOn && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <TitleRotator />
        {children}
      </body>
    </html>
  );

  return clerkOn ? (
    <ClerkProvider localization={clerkEsLocalization} appearance={clerkAppearance}>
      {tree}
    </ClerkProvider>
  ) : (
    tree
  );
}
