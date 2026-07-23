"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Heart, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/conta", label: "Visão geral", icon: LayoutGrid },
  { href: "/conta/pedidos", label: "Meus pedidos", icon: Package },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
