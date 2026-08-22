import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { byFechaDesc, onlyPublished } from "@/lib/data/published";
import { InformesList } from "./informes-list";

export const metadata = { title: "Informes" };

/** Socio Informes: read-only grid, searchable + filterable by category. */
export default async function SocioInformesPage() {
  const informes = byFechaDesc(
    onlyPublished(await getDataLayer().informes.list()),
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
