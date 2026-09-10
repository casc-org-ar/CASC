import { SectionHeading } from "@/components/shared/section-heading";
import { requireCategoria } from "@/lib/auth/member-status";
import { getDataLayer } from "@/lib/data";
import { byFechaDesc, onlyPublished } from "@/lib/data/published";
import { INFORMES_CATEGORIAS } from "@/lib/platform/navigation";
import { InformesList } from "./informes-list";

export const metadata = { title: "Informes" };

/** Socio Informes: read-only grid, searchable + filterable by category. */
export default async function SocioInformesPage() {
  // Sector reports are reserved for shopping centers. The sidebar hides the
  // link for other categories; this is what stops a direct URL.
  await requireCategoria(INFORMES_CATEGORIAS);

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
