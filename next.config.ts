import type { NextConfig } from "next";

/**
 * Legacy `*.html` URLs from the original CASC site redirect to their clean
 * Next.js routes, preserving SEO. Next uses 308 (permanent) — search engines
 * treat it like a 301, and the method is preserved.
 */
const legacyRedirects = [
  { from: "/index.html", to: "/" },
  { from: "/nosotros.html", to: "/nosotros" },
  { from: "/comision-directiva.html", to: "/comision-directiva" },
  { from: "/estatuto.html", to: "/estatuto" },
  { from: "/datos-del-sector.html", to: "/datos-del-sector" },
  { from: "/delegaciones-regionales.html", to: "/delegaciones-regionales" },
  { from: "/asociados.html", to: "/asociados" },
  { from: "/como-asociarse.html", to: "/como-asociarse" },
  { from: "/beneficios.html", to: "/beneficios" },
  { from: "/actividades.html", to: "/actividades" },
  { from: "/bolsa-de-trabajo.html", to: "/bolsa-de-trabajo" },
  { from: "/contacto.html", to: "/contacto" },
  { from: "/terminos-y-condiciones.html", to: "/terminos-y-condiciones" },
  { from: "/politicas-de-privacidad.html", to: "/politicas-de-privacidad" },
  { from: "/politica-de-cookies.html", to: "/politica-de-cookies" },
  { from: "/login.html", to: "/login" },
];

const associateCategoryRedirects = [
  {
    from: "/asociados/shopping-centers",
    to: "/asociados?categoria=shopping-centers#directorio",
  },
  {
    from: "/asociados/retailers",
    to: "/asociados?categoria=retailers#directorio",
  },
  {
    from: "/asociados/proveedores-de-servicios",
    to: "/asociados?categoria=proveedores-de-servicios#directorio",
  },
];

/**
 * Content-Security-Policy — the core XSS defense. Allowlists exactly the
 * external origins this app needs and denies everything else (fail closed).
 *
 * What each source enables:
 *  - Clerk (auth): its FAPI domain + protection/challenge domains. `'unsafe-
 *    inline'` on style-src is required by Clerk's runtime CSS-in-JS (per Clerk's
 *    CSP docs). script-src keeps `'unsafe-inline'` too — Next's inline runtime
 *    bootstrap needs it without a nonce pipeline; tightening to a nonce is a
 *    later hardening step.
 *  - Supabase (data): connect-src to the project host for queries + realtime
 *    (wss). img-src covers Storage-served images.
 *  - YouTube: frame-src for the institutional video embed (nocookie domain).
 *  - Images: `https:` so admin-pasted external content images (SafeImage) load;
 *    `data:` for inline/base64 assets.
 *
 * NEXT_PUBLIC_* values are inlined at build time. The Clerk/Supabase hosts come
 * from env so dev and prod (different domains) each get a correct policy.
 */
const clerkFapi =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
    ? "https://clerk.casc.org.ar"
    : "https://*.clerk.accounts.dev";
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// React uses eval() ONLY in development (debugging/stack traces); it never does
// in production. So `'unsafe-eval'` is allowed in dev and stays OUT of the prod
// policy — where it would be a real XSS amplifier.
const scriptEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${scriptEval} ${clerkFapi} https://*.protect.clerk.com https://challenges.cloudflare.com https://www.google.com https://www.gstatic.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${clerkFapi} https://*.protect.clerk.com ${supabaseHost} wss://${supabaseHost.replace(/^https?:\/\//, "")} https://www.google.com`,
  `frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://challenges.cloudflare.com https://*.protect.clerk.com https://www.google.com https://drive.google.com`,
  `worker-src 'self' blob:`,
  // Allow the informe PDF viewer (<object>) to load PDFs from Supabase Storage;
  // everything else stays blocked (no Flash/Java/arbitrary plugins).
  `object-src 'self' ${supabaseHost}`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
]
  .filter(Boolean)
  .join("; ");

/** Static security headers applied to every response. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), camera=(), microphone=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      // Uploads (cover images, CVs) travel through Server Actions. The default
      // 1 MB body cap rejects a phone photo before our client-side compression
      // can even help in edge cases. 6 MB leaves margin for an original image
      // and the 5 MB CV limit in the Bolsa de Trabajo.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Clerk serves user avatars from img.clerk.com; allow next/image to load it.
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
  async redirects() {
    return [
      ...legacyRedirects.map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      })),
      ...associateCategoryRedirects.flatMap((r) => [
        {
          source: r.from,
          destination: r.to,
          permanent: true,
        },
        {
          source: `${r.from}.html`,
          destination: r.to,
          permanent: true,
        },
      ]),
      // Associate fichas: /asociados/<slug>.html -> /asociados/<slug>
      {
        source: "/asociados/:slug.html",
        destination: "/asociados/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
