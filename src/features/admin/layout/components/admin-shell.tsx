"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/features/admin/layout/components/admin-sidebar";
import { AdminMobileNav } from "@/features/admin/layout/components/admin-mobile-nav";
import { AdminHeader } from "@/features/admin/layout/components/admin-header";

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      <AdminMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1680px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
