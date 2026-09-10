import {
  BadgePercent,
  BarChart3,
  CalendarDays,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  Mail,
  Newspaper,
  PenSquare,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CurrentUser, SocioCategoria, UserRole } from "@/lib/types/domain";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** External link → opens in a new tab with a plain anchor, not next/link. */
  external?: boolean;
  /**
   * Which member categories may see this item. Omitted = every category.
   * This is the SINGLE source of truth for section visibility: the sidebar
   * reads it to decide what to render, and the socio layout reads it to decide
   * what to let through. Adding a restricted section means adding it here and
   * nowhere else.
   *
   * Hiding a link is NOT access control on its own — anyone who knows the URL
   * would still reach the page. The route guard in the socio layout is what
   * actually closes the door; both consult this same list so they can never
   * disagree.
   */
  categorias?: readonly SocioCategoria[];
}

/** Only shopping centers: sector data CASC reserves for its member malls. */
const SOLO_SHOPPINGS = ["shopping"] as const;

/**
 * Categories allowed into Informes. Exported so the page guard and the sidebar
 * enforce the very same rule — if this list changes, both follow at once.
 */
export const INFORMES_CATEGORIAS = SOLO_SHOPPINGS;

/** Estadísticas: external Oracle APEX dashboard, opened in a new tab. */
const ESTADISTICAS: NavItem = {
  label: "Estadísticas",
  href: "https://estadisticas-casc.org.ar/apex/f?p=2000:LOGIN_DESKTOP:5946283282663:::::&tz=-3:00",
  icon: BarChart3,
  external: true,
  // Removed from the menu for providers and retailers. Unlike Informes, this
  // dashboard lives on Oracle's servers, not ours: hiding the link is all this
  // app can do, and anyone holding the URL still reaches Oracle's own login.
  // Restricting it for real is a change on that system, not here.
  categorias: SOLO_SHOPPINGS,
};

/** Sidebar navigation per role. Routes are filtered by role, never shown cross-role. */
const NAV: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Actividades", href: "/admin/actividades", icon: CalendarDays },
    { label: "Webinars", href: "/admin/webinars", icon: Video },
    { label: "Informes", href: "/admin/informes", icon: FileText },
    // Noticias unificadas en Blog: un artículo se marca con visibilidad
    // (socios / público / ambos). El admin de Noticias sale del menú; la
    // página y la tabla `noticias` quedan solo para lectura histórica.
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { label: "Beneficios", href: "/admin/beneficios", icon: BadgePercent },
    // Bolsa de trabajo oculta también del admin por ahora (encuadre legal).
    // La página y la moderación existen; solo se saca del menú.
    { label: "Solicitudes", href: "/admin/solicitudes", icon: Inbox },
    { label: "Noticias y Blog", href: "/admin/blog", icon: PenSquare },
    { label: "Socios", href: "/admin/socios", icon: Users },
    ESTADISTICAS,
  ],
  socio: [
    { label: "Inicio", href: "/socio", icon: Home },
    { label: "Actividades", href: "/socio/actividades", icon: CalendarDays },
    { label: "Webinars", href: "/socio/webinars", icon: Video },
    {
      label: "Informes",
      href: "/socio/informes",
      icon: FileText,
      categorias: SOLO_SHOPPINGS,
    },
    { label: "Noticias", href: "/socio/noticias", icon: Newspaper },
    { label: "Newsletter", href: "/socio/newsletter", icon: Mail },
    { label: "Beneficios", href: "/socio/beneficios", icon: BadgePercent },
    // Bolsa de trabajo: solo admin. Los socios no la ven (pedido del cliente).
    ESTADISTICAS,
  ],
};

/**
 * Every nav item of a section, unfiltered by category.
 *
 * Used by the ADMIN surface, where category does not apply: an admin has no
 * socios row and therefore no category. For the socio surface use
 * `getNavForUser`, which applies the category rules.
 */
export function getNavForRole(role: UserRole): NavItem[] {
  return NAV[role];
}

/**
 * Whether a member of `categoria` may see `item`.
 *
 * A member with NO resolved category is denied a restricted item, never granted
 * it. That state should not happen — the socio layout redirects members whose
 * row is not linked yet — so reaching here without one means something
 * unexpected, and an unexpected state must not be the one that opens the door.
 *
 * This matches `requireCategoria` exactly, on purpose: if the menu were the
 * lenient one, it would advertise a link the route then refuses.
 *
 * Admins never reach this function; `getNavForUser` returns early for them.
 */
function visibleFor(item: NavItem, categoria?: SocioCategoria): boolean {
  if (!item.categorias) return true;
  if (!categoria) return false;
  return item.categorias.includes(categoria);
}

/**
 * Navigation for a specific user: role decides the section, category filters
 * the restricted items within it.
 *
 * The admin surface is never filtered by category. On the socio surface, an
 * admin previewing it keeps seeing every item — they are not a member, and
 * nothing there is hidden from them anyway.
 */
export function getNavForUser(
  section: UserRole,
  user: Pick<CurrentUser, "role" | "categoria">,
): NavItem[] {
  const items = NAV[section];
  if (section === "admin" || user.role === "admin") return items;
  return items.filter((item) => visibleFor(item, user.categoria));
}

/**
 * Whether a member may open `pathname` on the socio surface.
 *
 * The route guard calls this; it reads the SAME `categorias` lists the sidebar
 * does, so a hidden link and a blocked route can never drift apart.
 *
 * Matching mirrors the sidebar's "active item" rule: an exact hit, or a
 * `/section/...` prefix so detail pages (`/socio/informes/[id]`) inherit their
 * section's restriction. External items are skipped — they are not routes of
 * this app, and their href would never match a pathname.
 */
export function canAccessPath(
  pathname: string,
  user: Pick<CurrentUser, "role" | "categoria">,
): boolean {
  if (user.role === "admin") return true;

  const restricted = NAV.socio.filter((item) => item.categorias && !item.external);
  for (const item of restricted) {
    const matches =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (matches && !visibleFor(item, user.categoria)) return false;
  }
  return true;
}
