import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { CandidatosList } from "./candidatos-list";

/**
 * Socio Bolsa de Trabajo: recruiters browse published (moderated) candidates,
 * filtering by skill, area and availability. Only published candidates are ever
 * loaded — pending ones stay hidden until an admin reviews them.
 */
export default async function SocioBolsaTrabajoPage() {
  const candidatos = onlyPublished(
    await getDataLayer().candidatos.list(),
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <SectionHeading
        title="Bolsa de Trabajo"
        subtitle="Perfiles de candidatos para tus búsquedas"
      />
      <CandidatosList candidatos={candidatos} />
    </>
  );
}
