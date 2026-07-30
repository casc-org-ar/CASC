import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";
import { NoticiasList } from "./noticias-list";

export const metadata = { title: "Noticias" };

/**
 * Socio Noticias: feed of published articles flagged for members, with an
 * optional tag filter. Blog + noticias are one entity now, so this reads the
 * blog repo and keeps only articles whose `visibilidad` includes socios.
 */
export default async function SocioNoticiasPage() {
  const noticias = byVisibilidad(
    onlyPublished(await getDataLayer().blog.list()),
    "socios",
  ).sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <SectionHeading title="Noticias" subtitle="Novedades institucionales" />
      <NoticiasList noticias={noticias} />
    </>
  );
}
