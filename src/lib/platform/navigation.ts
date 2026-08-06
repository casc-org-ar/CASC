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
import type { UserRole } from "@/lib/types/domain";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** External link → opens in a new tab with a plain anchor, not next/link. */
  external?: boolean;
}

/** Estadísticas: external Oracle APEX dashboard, opened in a new tab. */
const ESTADISTICAS: NavItem = {
  label: "Estadísticas",
  href: "https://estadisticas-casc.org.ar/apex/f?p=2000:LOGIN_DESKTOP:5946283282663:::::&tz=-3:00",
  icon: BarChart3,
  external: true,
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
    { label: "Informes", href: "/socio/informes", icon: FileText },
    { label: "Noticias", href: "/socio/noticias", icon: Newspaper },
    { label: "Newsletter", href: "/socio/newsletter", icon: Mail },
    { label: "Beneficios", href: "/socio/beneficios", icon: BadgePercent },
    // Bolsa de trabajo: solo admin. Los socios no la ven (pedido del cliente).
    ESTADISTICAS,
  ],
};

export function getNavForRole(role: UserRole): NavItem[] {
  return NAV[role];
}
