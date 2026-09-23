import { redirect } from "next/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { getEncuestaEstado } from "@/lib/data/encuesta-estado";
import { getEncuestaTextos } from "@/lib/data/encuesta-textos";
import { EncuestaForm } from "./encuesta-form";

export const metadata = { title: "Encuesta" };

/**
 * The member satisfaction survey.
 *
 * Reached from the home CTA — there is no sidebar entry, on purpose: once
 * answered, the survey is over for that member, and a permanent menu item
 * would advertise a page that immediately bounces them away.
 *
 * Three cases:
 *
 *  - A member who can still answer gets the form.
 *  - An ADMIN gets it read-only. They have no `socios` row, so the insert
 *    policy would refuse their answer — but CASC still has to be able to
 *    review the survey they are sending to their members, and a link that
 *    bounces them out is no way to review anything.
 *  - A member who already answered is sent back to the home, NOT shown their
 *    filled-in answers. "El socio no puede modificar las respuestas": showing
 *    the form again invites an edit the platform will not accept.
 */
export default async function EncuestaPage() {
  const [{ pendiente, esAdmin }, textos] = await Promise.all([
    getEncuestaEstado(),
    getEncuestaTextos(),
  ]);
  if (!pendiente) redirect("/socio");

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        title={textos.titulo}
        subtitle={
          // The admin's subtitle explains the preview instead of CASC's own
          // wording: what they need to know here is that their submission
          // will not count, which no editable text should be able to hide.
          esAdmin
            ? "Así ven los socios la encuesta. Podés completarla y enviarla para probar el circuito: se guarda marcada como prueba y no entra en los resultados."
            : textos.subtitulo
        }
      />
      <EncuestaForm textos={textos} esAdmin={esAdmin} />
    </div>
  );
}
