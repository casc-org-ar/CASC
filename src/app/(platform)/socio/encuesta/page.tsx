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
 * A member who already answered is redirected to the panel home instead of
 * being shown a read-only copy of their answers. "El socio no puede modificar
 * las respuestas": showing the filled form invites an edit the platform will
 * not accept, and a disabled form is a worse way to say "this is closed" than
 * simply not being there. The home carries the thank-you message instead.
 */
export default async function EncuestaPage() {
  const { pendiente } = await getEncuestaEstado();
  if (!pendiente) redirect("/socio");

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        title="Encuesta a socios"
        subtitle="Tres minutos para ayudarnos a mejorar los servicios de la Cámara. Tus respuestas llegan directo al equipo de la CASC."
      />
      <EncuestaForm />
    </div>
  );
}
