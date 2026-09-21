import { redirect } from "next/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { getEncuestaEstado } from "@/lib/data/encuesta-estado";
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
  // `pendiente` already covers the admin, who is offered the survey like any
  // member and only stopped at the submit — see `getEncuestaEstado`.
  const { pendiente, soloLectura } = await getEncuestaEstado();
  if (!pendiente) redirect("/socio");

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        title="Encuesta a socios"
        subtitle={
          soloLectura
            ? "Así ven los socios la encuesta. Esta es una vista previa: desde una cuenta de administración no se puede responder."
            : "Tres minutos para ayudarnos a mejorar los servicios de la Cámara. Tus respuestas llegan directo al equipo de la CASC."
        }
      />
      <EncuestaForm soloLectura={soloLectura} />
    </div>
  );
}
