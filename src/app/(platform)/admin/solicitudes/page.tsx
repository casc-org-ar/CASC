import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { SolicitudesManager } from "./solicitudes-manager";

export const metadata = { title: "Solicitudes" };

/**
 * Admin inbox for the public forms: membership requests and contact enquiries.
 * Newest first so new messages surface at the top.
 */
export default async function AdminSolicitudesPage() {
  const data = getDataLayer();
  const [solicitudes, consultas] = await Promise.all([
    data.solicitudes.list(),
    data.consultas.list(),
  ]);

  const porFecha = <T extends { createdAt: string }>(items: T[]) =>
    [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <SectionHeading
        title="Solicitudes y consultas"
        subtitle="Mensajes recibidos desde el sitio público"
      />
      <SolicitudesManager
        solicitudes={porFecha(solicitudes)}
        consultas={porFecha(consultas)}
      />
    </>
  );
}
