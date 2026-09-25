import { SectionHeading } from "@/components/shared/section-heading";
import { getAuth } from "@/lib/auth";
import { getMemberAccess } from "@/lib/auth/member-status";
import { getDataLayer } from "@/lib/data";
import { byCategoria, byFechaDesc, onlyPublished } from "@/lib/data/published";
import { InformesList } from "./informes-list";

export const metadata = { title: "Informes" };

/**
 * Socio Informes: read-only grid, searchable + filterable by category.
 *
 * The section is open to every member; each report declares which categories
 * may see it (migration 0027), and the listing shows only those. It used to be
 * reserved for shopping centers as a whole, which meant opening one report to
 * providers required opening all of them.
 *
 * There is no `requireCategoria` guard any more because there is nothing left
 * to guard at the section level: a member who may see no report gets an empty
 * listing, which is the same outcome the guard produced, minus the redirect.
 * What protects an individual report is the detail page, which checks its
 * audience before minting the signed PDF URL.
 */
export default async function SocioInformesPage() {
  const [user, informes] = await Promise.all([
    getAuth().getCurrentUser(),
    getDataLayer().informes.list(),
  ]);

  const publicados = byFechaDesc(onlyPublished(informes));

  // An admin previewing the socio surface has no `socios` row and therefore no
  // category. They see everything: the preview exists to show what CASC
  // publishes, and filtering them to nothing would show them an empty section
  // that no member actually sees.
  const esAdmin = user?.role === "admin";
  const { categoria } = esAdmin
    ? { categoria: undefined }
    : await resolverCategoria();

  const visibles = esAdmin ? publicados : byCategoria(publicados, categoria);

  return (
    <>
      <SectionHeading
        title="Informes"
        subtitle="Documentos y reportes del sector"
      />
      <InformesList
        informes={visibles}
        // There ARE published reports, just none for this member's category —
        // which the empty state explains instead of claiming none exist.
        hayInformesReservados={
          visibles.length === 0 && publicados.length > 0
        }
      />
    </>
  );
}

/**
 * The current member's category, or undefined when it cannot be resolved.
 *
 * `getMemberAccess` already read the row the layout used to let this member
 * in, so this asks the same question the guard did rather than a second,
 * weaker one. A member who is not allowed resolves to undefined and, through
 * `byCategoria`, sees nothing — the layout will already have redirected them,
 * so this is the fail-closed path, not the expected one.
 */
async function resolverCategoria() {
  const access = await getMemberAccess();
  return { categoria: access.allowed ? access.categoria : undefined };
}
