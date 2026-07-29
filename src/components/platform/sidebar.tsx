"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/platform/account-menu";
import { SectionSwitcher } from "@/components/platform/section-switcher";
import { getNavForRole } from "@/lib/platform/navigation";
import type { CurrentUser, UserRole } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: CurrentUser;
  /** Controls the slide-in state on mobile. */
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ user, open, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  // Which section is being viewed, from the URL — NOT from the user's role.
  // This lets an admin browse the socio section (preview) while staying admin.
  // It's navigation only: every server action still re-checks the real role.
  const section: UserRole = pathname.startsWith("/socio") ? "socio" : "admin";
  const items = getNavForRole(section);
  const isAdminSurface = section === "admin";
  const canSwitch = user.role === "admin";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col text-white transition-transform lg:translate-x-0",
        // The surface color tracks the SECTION being viewed, so an admin
        // previewing socio sees the socio (navy) chrome — an unmistakable cue
        // of which side they're on.
        isAdminSurface ? "bg-casc-black" : "bg-casc-navy-900",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link
          href={`/${section}`}
          onClick={onNavigate}
          aria-label="CASC — inicio"
        >
          <Image
            src="/brand/casc-logo-full-white.png"
            alt="CASC — Cámara Argentina de Shopping Centers"
            width={176}
            height={80}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {canSwitch && (
        <SectionSwitcher section={section} onNavigate={onNavigate} />
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            !item.external &&
            (pathname === item.href ||
              (item.href !== `/${section}` && pathname.startsWith(item.href)));
          const Icon = item.icon;
          const className = cn(
            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-primary text-white"
              : "text-blue-100 hover:bg-white/10",
          );
          const inner = (
            <>
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              {item.label}
            </>
          );

          // External links (e.g. the stats dashboard) open in a new tab with a
          // plain anchor; internal routes use next/link for client navigation.
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={className}
            >
              {inner}
            </Link>
          );
        })}
      </nav>

      <AccountMenu user={user} />
    </aside>
  );
}
