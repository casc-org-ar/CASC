import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://casc.org.ar";

/**
 * robots.txt — lets crawlers index the public site but keeps the private
 * platform and auth flows out of search results. The panel (/admin, /socio),
 * the login/sign-in pages and the internal /login carry no public value and
 * shouldn't appear in Google.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/socio", "/login", "/sign-in", "/sign-up"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
