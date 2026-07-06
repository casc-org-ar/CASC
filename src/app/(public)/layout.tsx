import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

/**
 * Public institutional site layout. Wraps every page under (public) with the
 * shared header and footer. The header is fixed, so main content is offset by
 * its height (h-16 = 4rem).
 */
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
