"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/features/admin/layout/nav-items";
import { storeInfo } from "@/data/store-info";

export function AdminMobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Menu do painel</SheetTitle>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            {storeInfo.name.slice(0, 1)}
          </div>
          <span className="truncate text-sm font-semibold text-foreground">
            {storeInfo.name} <span className="text-muted-foreground">Admin</span>
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-2.5">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <item.icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
