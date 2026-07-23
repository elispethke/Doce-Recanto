"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

export function AdminProfileMenu() {
  const { adminProfile, user, signOutUser } = useAuth();
  const name = adminProfile?.name ?? adminProfile?.email ?? "Administrador";
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Menu do administrador"
            className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1.5 hover:bg-accent"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight sm:block">
          <p className="max-w-32 truncate text-xs font-semibold text-foreground">{name}</p>
          <p className="max-w-32 truncate text-[0.65rem] text-muted-foreground">{user?.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <UserRound className="size-4" /> Meu perfil
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="size-4" /> Preferências
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOutUser()}>
          <LogOut className="size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
