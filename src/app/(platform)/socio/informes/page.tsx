import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { InformesList } from "./informes-list";

/** Socio Informes: read-only list, filterable by category, view/download. */
export default async function SocioInformesPage() {
  const informes = onlyPublished(await getDataLayer().informes.list());

  return (
    <>
      <SectionHeading
        title="Informes"
        subtitle="Documentos y reportes del sector"
      />
      {informes.length === 0 ? (
        <EmptyState message="No hay informes publicados por el momento." />
      ) : (
        <InformesList informes={informes} />
      )}
    </>
  );
}
