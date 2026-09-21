import { ArrowRight, ClipboardList } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Invitation to answer the survey, shown at the top of the socio home.
 *
 * A banner on the home rather than a section of its own: "que la encuesta
 * aparezca en el inicio con un CTA para hacerla, no como una sección
 * separada". A sidebar entry would also outlive its purpose — once answered,
 * there is nothing behind it.
 *
 * It renders only while the member still owes an answer; the home decides that
 * (see `getEncuestaEstado`), so this component stays presentational.
 *
 * No deadline is shown because there is none ("no poner fecha límite"). What it
 * does say is how long it takes and that it is answered once — the two things
 * that actually decide whether someone starts it now or puts it off.
 */
export function EncuestaCta() {
  return (
    <section
      aria-labelledby="encuesta-cta-titulo"
      className="animate-fade-in-up rounded-xl border border-accent bg-accent/10 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ClipboardList
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden
          />
          <div>
            <h2
              id="encuesta-cta-titulo"
              className="text-base font-bold tracking-tight text-ink"
            >
              Queremos escucharte
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Respondé la encuesta a socios y ayudanos a mejorar los servicios
              de la Cámara. Son 3 minutos y se completa una sola vez.
            </p>
          </div>
        </div>
        <ButtonLink href="/socio/encuesta" className="shrink-0">
          Responder encuesta
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      </div>
    </section>
  );
}
