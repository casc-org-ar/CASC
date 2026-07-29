import {
  BadgePercent,
  BarChart3,
  Briefcase,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
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
    { label: "Webinars", href: "/admin/webinars", icon: Video },
    { label: "Informes", href: "/admin/informes", icon: FileText },
    { label: "Noticias", href: "/admin/noticias", icon: Newspaper },
    { label: "Beneficios", href: "/admin/beneficios", icon: BadgePercent },
    { label: "Bolsa de trabajo", href: "/admin/bolsa-de-trabajo", icon: Briefcase },
    { label: "Solicitudes", href: "/admin/solicitudes", icon: Inbox },
    { label: "Blog", href: "/admin/blog", icon: PenSquare },
    { label: "Socios", href: "/admin/socios", icon: Users },
    ESTADISTICAS,
  ],
  socio: [
    { label: "Inicio", href: "/socio", icon: Home },
    { label: "Webinars", href: "/socio/webinars", icon: Video },
    { label: "Informes", href: "/socio/informes", icon: FileText },
    { label: "Noticias", href: "/socio/noticias", icon: Newspaper },
    { label: "Beneficios", href: "/socio/beneficios", icon: BadgePercent },
    { label: "Bolsa de trabajo", href: "/socio/bolsa-de-trabajo", icon: Briefcase },
    ESTADISTICAS,
  ],
};

export function getNavForRole(role: UserRole): NavItem[] {
  return NAV[role];
}
