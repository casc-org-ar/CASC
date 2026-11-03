"use client";

import { usePathname } from "next/navigation";

/**
 * Pages that render their own footer instead of the shared site footer
 * (campaign landings). Exact paths only: their subpages keep the site footer.
 */
const OWN_FOOTER_PATHS = new Set(["/black-shopping-days"]);

/** Renders the site footer (passed as children) unless the page has its own. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (OWN_FOOTER_PATHS.has(pathname)) return null;
  return children;
}
