import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { BolsaTrabajoManager } from "./bolsa-trabajo-manager";

/**
 * Admin Bolsa de Trabajo: moderate candidates submitted from the public
 * landing. Newest first so pending submissions surface at the top.
 */
export default async function AdminBolsaTrabajoPage() {
  const candidatos = (await getDataLayer().candidatos.list()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <SectionHeading
        title="Bolsa de Trabajo"
        subtitle="Moderación de candidatos"
      />
      <BolsaTrabajoManager candidatos={candidatos} />
    </>
  );
}
