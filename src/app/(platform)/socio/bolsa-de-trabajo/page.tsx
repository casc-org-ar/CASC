import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { CandidatosList } from "./candidatos-list";

export const metadata = { title: "Bolsa de Trabajo" };

/**
 * Socio Bolsa de Trabajo: recruiters browse published (moderated) candidates,
 * filtering by skill, area and availability. Only published candidates are ever
 * loaded — pending ones stay hidden until an admin reviews them.
 */
export default async function SocioBolsaTrabajoPage() {
  // `id` breaks ties so candidates created in the same instant keep a stable
  // order instead of reshuffling between requests.
  const candidatos = onlyPublished(
    await getDataLayer().candidatos.list(),
  ).sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
  );

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
