import { Suspense } from "react";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ScrollToTop } from "@/components/public/scroll-to-top";

/**
 * Public institutional site layout. Wraps every page under (public) with the
 * shared header and footer. The header is fixed, so main content is offset by
 * its height (h-20 = 5rem, lg:h-24 = 6rem).
 */
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-20 lg:h-24" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-grow pt-20 lg:pt-24">{children}</main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
