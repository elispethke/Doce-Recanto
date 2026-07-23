"use client";

import { Menu } from "lucide-react";
import { AdminBreadcrumbs } from "@/features/admin/layout/components/admin-breadcrumbs";
import { AdminProfileMenu } from "@/features/admin/layout/components/admin-profile-menu";

export function AdminHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        onClick={onOpenMobileNav}
        aria-label="Abrir menu"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="size-4.5" />
      </button>

      <AdminBreadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <AdminProfileMenu />
      </div>
    </header>
  );
}
