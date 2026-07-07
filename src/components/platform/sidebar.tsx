"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/platform/account-menu";
import { getNavForRole } from "@/lib/platform/navigation";
import type { CurrentUser } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: CurrentUser;
  /** Controls the slide-in state on mobile. */
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ user, open, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const items = getNavForRole(user.role);
  const isAdmin = user.role === "admin";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col text-white transition-transform lg:translate-x-0",
        // Admin gets the near-black surface, socio the institutional navy.
        // Same brand palette — a glance tells the two panels apart.
        isAdmin ? "bg-casc-black" : "bg-casc-navy-900",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-24 items-center border-b border-white/10 px-6">
        <Link
          href={`/${user.role}`}
          onClick={onNavigate}
          aria-label="CASC — inicio"
        >
          <Image
            src="/brand/casc-logo-full-white.png"
            alt="CASC — Cámara Argentina de Shopping Centers"
            width={300}
            height={212}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== `/${user.role}` && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-blue-100 hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <AccountMenu user={user} />
    </aside>
  );
}
