import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { InformesList } from "./informes-list";

export const metadata = { title: "Informes" };

/** Socio Informes: read-only grid, searchable + filterable by category. */
export default async function SocioInformesPage() {
  const informes = onlyPublished(await getDataLayer().informes.list()).sort(
    (a, b) => b.fecha.localeCompare(a.fecha),
  );

  return (
    <>
      <SectionHeading
        title="Informes"
        subtitle="Documentos y reportes del sector"
      />
      <InformesList informes={informes} />
    </>
  );
}
