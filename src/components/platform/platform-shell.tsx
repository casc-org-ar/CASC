"use client";

import { useState } from "react";
import { Sidebar } from "@/components/platform/sidebar";
import { Topbar } from "@/components/platform/topbar";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import type { CurrentUser } from "@/lib/types/domain";

interface PlatformShellProps {
  user: CurrentUser;
  showDevSwitcher: boolean;
  children: React.ReactNode;
}

/**
 * Client shell: owns the mobile sidebar open/close state and lays out the
 * fixed sidebar + sticky topbar + scrollable content. The authenticated
 * user is resolved on the server and passed in.
 */
export function PlatformShell({
  user,
  showDevSwitcher,
  children,
}: PlatformShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface">
        <Sidebar
          user={user}
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        <div className="lg:pl-64">
          <Topbar
            role={user.role}
            showDevSwitcher={showDevSwitcher}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="w-full px-4 py-8 lg:px-10 xl:px-12">
            {children}
          </main>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}
