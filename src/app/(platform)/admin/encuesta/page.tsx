import { Eye } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";
import { ENCUESTA_SLUG_ACTUAL } from "@/lib/types/domain";
import { EncuestaManager, type RespuestaConSocio } from "./encuesta-manager";

export const metadata = { title: "Encuesta" };

/**
 * Admin view of the member satisfaction survey: the aggregate read, the
 * individual answers, and the CSV download CASC asked for.
 *
 * Answers store a `socioId`, not a name — the survey is about the Cámara, and
 * duplicating member data into every row would mean a renamed shopping center
 * disagreeing with itself across the table. The join happens here, on the
 * server, where both lists are already being read: under RLS the admin sees
 * every socio and every answer, so this is one pass over data already in hand.
 */
export default async function AdminEncuestaPage() {
  const data = getDataLayer();
  const [respuestas, socios] = await Promise.all([
    data.encuesta.list(),
    data.socios.list(),
  ]);

  const porId = new Map(socios.map((s) => [s.id, s]));

  const filas: RespuestaConSocio[] = respuestas
    .filter((r) => r.encuestaSlug === ENCUESTA_SLUG_ACTUAL)
    // Newest first, `id` breaking ties so answers recorded in the same instant
    // keep a stable order between requests instead of reshuffling.
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    )
    .map((respuesta) => {
      const socio = porId.get(respuesta.socioId);
      return {
        respuesta,
        // A deleted member takes their answers with them (`on delete cascade`),
        // so a missing socio should not happen. It is rendered rather than
        // dropped: an answer that exists must be counted, and silently hiding
        // it would make the totals disagree with the database.
        socioNombre: socio?.nombre ?? "Socio dado de baja",
        socioShopping: socio?.shopping ?? "",
        socioEmail: socio?.email ?? "",
      };
    });

  // The invited base the response rate is measured against: active members,
  // excluding admin accounts, which are staff and were never asked.
  const sociosActivos = socios.filter(
    (s) => s.role === "socio" && s.estado === "activo",
  ).length;

  return (
    <>
      {/* `SectionHeading` carries its own bottom margin, so the row does not
          add one of its own. */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          title="Encuesta a socios"
          subtitle="Respuestas recibidas y descarga de resultados"
        />
        {/* The way in to the survey itself. Admins get no home CTA (they have
            no socios row and cannot answer), so without this link there is no
            way for CASC to look at the form they are sending out. */}
        <ButtonLink href="/socio/encuesta" variant="secondary">
          <Eye className="h-4 w-4" aria-hidden />
          Ver la encuesta
        </ButtonLink>
      </div>
      <EncuestaManager filas={filas} sociosActivos={sociosActivos} />
    </>
  );
}
