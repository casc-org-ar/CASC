import {
  BadgePercent,
  Briefcase,
  FileText,
  Home,
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
}

/** Sidebar navigation per role. Routes are filtered by role, never shown cross-role. */
const NAV: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Webinars", href: "/admin/webinars", icon: Video },
    { label: "Informes", href: "/admin/informes", icon: FileText },
    { label: "Noticias", href: "/admin/noticias", icon: Newspaper },
    { label: "Beneficios", href: "/admin/beneficios", icon: BadgePercent },
    { label: "Bolsa de trabajo", href: "/admin/bolsa-de-trabajo", icon: Briefcase },
    { label: "Blog", href: "/admin/blog", icon: PenSquare },
    { label: "Socios", href: "/admin/socios", icon: Users },
  ],
  socio: [
    { label: "Inicio", href: "/socio", icon: Home },
    { label: "Webinars", href: "/socio/webinars", icon: Video },
    { label: "Informes", href: "/socio/informes", icon: FileText },
    { label: "Noticias", href: "/socio/noticias", icon: Newspaper },
    { label: "Beneficios", href: "/socio/beneficios", icon: BadgePercent },
    { label: "Bolsa de trabajo", href: "/socio/bolsa-de-trabajo", icon: Briefcase },
  ],
};

export function getNavForRole(role: UserRole): NavItem[] {
  return NAV[role];
}
