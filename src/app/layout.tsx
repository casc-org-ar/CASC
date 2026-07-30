import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkEsLocalization } from "@/lib/auth/clerk-localization";
import "./globals.css";
import { TitleRotator } from "@/components/shared/title-rotator";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";

/**
 * Clerk is only mounted when it's the active provider. In mock mode the app
 * runs with no Clerk keys and no Clerk runtime — the public site pays nothing.
 */
const clerkOn = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "CASC — Plataforma institucional",
  description:
    "Plataforma interna de la Cámara Argentina de Shopping Centers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = (
    <html lang="es" className={`${inter.variable} h-full`}>
      {/* Browser extensions (ColorZilla, password managers) inject attributes
          on <body> before hydration; suppress the mismatch on this node only. */}
      <body className="min-h-full" suppressHydrationWarning>
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
