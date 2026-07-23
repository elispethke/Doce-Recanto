"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { adminNavItems } from "@/features/admin/layout/nav-items";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = (pathname ?? "").split("/").filter(Boolean).slice(1); // remove "admin"

  const current = adminNavItems.find((item) => item.href === `/admin/${segments[0] ?? ""}`);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-3.5" />
      </Link>
      {current && (
        <>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">{current.label}</span>
        </>
      )}
      {segments.length > 1 && (
        <>
          <ChevronRight className="size-3.5" />
          <span className="capitalize">{segments[segments.length - 1]}</span>
        </>
      )}
    </nav>
  );
}
