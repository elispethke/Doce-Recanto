"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomerAuth } from "@/contexts/customer-auth-context";

const links = [
  { href: "/conta/pedidos", label: "Meus pedidos", icon: Package },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
];

export function AccountMenu() {
  const router = useRouter();
  const { status, profile, signOutUser } = useCustomerAuth();

  if (status !== "authenticated") {
    return (
      <button
        onClick={() => router.push("/login")}
        aria-label="Entrar na minha conta"
        className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-accent"
      >
        <User className="size-5" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Minha conta"
            className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
          />
        }
      >
        <span className="text-xs font-semibold">
          {(profile?.name ?? "C").slice(0, 1).toUpperCase()}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {profile?.name ?? "Minha conta"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {links.map((link) => (
            <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
              <link.icon className="size-4" /> {link.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOutUser()}>
          <LogOut className="size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
