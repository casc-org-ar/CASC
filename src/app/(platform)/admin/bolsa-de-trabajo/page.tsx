import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { BolsaTrabajoManager } from "./bolsa-trabajo-manager";

export const metadata = { title: "Bolsa de Trabajo" };

/**
 * Admin Bolsa de Trabajo: moderate candidates submitted from the public
 * landing. Newest first so pending submissions surface at the top.
 */
export default async function AdminBolsaTrabajoPage() {
  // `id` breaks ties so candidates created in the same instant keep a stable
  // order instead of reshuffling between requests.
  const candidatos = (await getDataLayer().candidatos.list()).sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
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
