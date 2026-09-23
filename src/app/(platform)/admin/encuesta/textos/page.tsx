import { ArrowLeft, Info } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";
import { getEncuestaTextos } from "@/lib/data/encuesta-textos";
import { ENCUESTA_SLUG_ACTUAL } from "@/lib/types/domain";
import { TextosForm } from "./textos-form";

export const metadata = { title: "Editar encuesta" };

/**
 * Edit the survey's wording.
 *
 * Scope is deliberately narrow: the questions and their types are fixed
 * columns, so this changes how the survey reads, not what it asks. The notice
 * says so on the page — an admin who came here to add a question should learn
 * that before writing one, not after saving.
 */
export default async function AdminEncuestaTextosPage() {
  const [textos, respuestas] = await Promise.all([
    getEncuestaTextos(),
    getDataLayer().encuesta.list(),
  ]);

  // Only real answers to the CURRENT survey: the warning is about
  // reinterpreting what members said, and test rows are not that.
  const yaRespondieron = respuestas.filter(
    (r) => !r.esPrueba && r.encuestaSlug === ENCUESTA_SLUG_ACTUAL,
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          title="Editar la encuesta"
          subtitle="Cambiá cómo está redactada cada pregunta y qué opciones se ofrecen"
        />
        <ButtonLink href="/admin/encuesta" variant="secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a los resultados
        </ButtonLink>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="text-sm text-ink-muted">
          <p>
            Se edita el texto de las preguntas y las opciones que se ofrecen.
            Las nueve preguntas y su tipo (escala, abierta, elección) son fijos:
            agregar o quitar preguntas es un desarrollo aparte.
          </p>
          {/* Stated only when it is true. The point is not that editing is
              risky — it is that it is SAFE, because answers keep the wording
              they were given, and an admin about to reword a live survey
              deserves to know that before hesitating. */}
          {yaRespondieron > 0 && (
            <p className="mt-2">
              Ya hay {yaRespondieron} respuesta
              {yaRespondieron === 1 ? "" : "s"} de socios. Tus cambios afectan
              solo a quienes respondan de ahora en más: cada respuesta guarda
              el texto que leyó quien la envió.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <TextosForm textos={textos} />
      </div>
    </>
  );
}
