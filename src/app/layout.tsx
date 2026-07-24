import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TitleRotator } from "@/components/shared/title-rotator";

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
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      {/* Browser extensions (ColorZilla, password managers) inject attributes
          on <body> before hydration; suppress the mismatch on this node only. */}
      <body className="min-h-full" suppressHydrationWarning>
        <TitleRotator />
        {children}
      </body>
    </html>
  );
}
