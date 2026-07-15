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

const nextConfig: NextConfig = {
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
};

export default nextConfig;
