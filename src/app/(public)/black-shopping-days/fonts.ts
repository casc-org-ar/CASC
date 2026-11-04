import { Boldonse } from "next/font/google";
import localFont from "next/font/local";

/** Campaign typefaces, shared by the landing and its legal page. */

export const bsdDisplay = Boldonse({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bsd-display",
  display: "swap",
  // Next has no metric overrides for Boldonse; skip the generated fallback.
  adjustFontFallback: false,
});

export const bsdBody = localFont({
  src: [
    { path: "./fonts/satoshi-400.woff2", weight: "400" },
    { path: "./fonts/satoshi-500.woff2", weight: "500" },
    { path: "./fonts/satoshi-700.woff2", weight: "700" },
    { path: "./fonts/satoshi-900.woff2", weight: "900" },
  ],
  variable: "--font-bsd-body",
  display: "swap",
});
