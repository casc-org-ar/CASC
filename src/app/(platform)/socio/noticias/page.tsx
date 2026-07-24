import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { NoticiasList } from "./noticias-list";

export const metadata = { title: "Noticias" };

/** Socio Noticias: feed of published news with an optional category filter. */
export default async function SocioNoticiasPage() {
  const noticias = onlyPublished(await getDataLayer().noticias.list()).sort(
    (a, b) => b.fecha.localeCompare(a.fecha),
  );

  return (
    <>
      <SectionHeading title="Noticias" subtitle="Novedades institucionales" />
      <NoticiasList noticias={noticias} />
    </>
  );
}
