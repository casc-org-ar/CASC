import { redirect } from "next/navigation";

/**
 * Bolsa de Trabajo — OCULTA temporalmente del sitio público por encuadre legal
 * (tratamiento de datos personales, ley 25.326). No se enlaza desde ningún menú
 * ni figura en el sitemap; si alguien entra por URL directa, se redirige al
 * inicio. La versión pública completa (formulario, pasos, LinkedIn) vive en el
 * historial de git y se puede restaurar cuando se habilite.
 */
export default function BolsaDeTrabajoPage() {
  redirect("/");
}
