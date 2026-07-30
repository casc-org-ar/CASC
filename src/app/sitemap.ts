import type { MetadataRoute } from "next";
import { asociados } from "@/lib/data/asociados";
import { getPublicDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://casc.org.ar";

/** Static public routes, with a rough priority/frequency per section. */
const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.8 },
  { path: "/comision-directiva", changeFrequency: "monthly", priority: 0.6 },
  { path: "/datos-del-sector", changeFrequency: "monthly", priority: 0.7 },
  { path: "/delegaciones-regionales", changeFrequency: "monthly", priority: 0.6 },
  { path: "/asociados", changeFrequency: "weekly", priority: 0.8 },
  { path: "/beneficios", changeFrequency: "weekly", priority: 0.7 },
  { path: "/actividades", changeFrequency: "weekly", priority: 0.7 },
  { path: "/noticias", changeFrequency: "daily", priority: 0.8 },
  { path: "/como-asociarse", changeFrequency: "monthly", priority: 0.9 },
  // /bolsa-de-trabajo se omite a propósito (oculta por encuadre legal).
  { path: "/contacto", changeFrequency: "yearly", priority: 0.5 },
  { path: "/estatuto", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos-y-condiciones", changeFrequency: "yearly", priority: 0.2 },
  { path: "/politicas-de-privacidad", changeFrequency: "yearly", priority: 0.2 },
  { path: "/politica-de-cookies", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Dynamic sitemap: the static public pages plus the content pages that come
 * from data — associate fichas and published news articles. Private routes
 * (panel, auth) are intentionally excluded (also blocked in robots.ts).
 *
 * News is read through the PUBLIC data layer (anonymous client, published only)
 * so this works at build time without a Clerk session.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const asociadoEntries: MetadataRoute.Sitemap = asociados.map((a) => ({
    url: `${siteUrl}/asociados/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  let noticiaEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = onlyPublished(await getPublicDataLayer().blog.list());
    noticiaEntries = posts.map((p) => ({
      url: `${siteUrl}/noticias/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // If content can't be read at build time, still emit the static sitemap.
  }

  return [...staticEntries, ...asociadoEntries, ...noticiaEntries];
}
