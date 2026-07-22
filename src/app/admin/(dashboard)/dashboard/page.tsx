"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function AdminDashboardPage() {
  const { adminProfile, signOutUser } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Doce Encanto — Painel</p>
          <p className="text-xs text-muted-foreground">
            Logado como {adminProfile?.name ?? adminProfile?.email}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOutUser()} className="gap-1.5">
          <LogOut className="size-4" /> Sair
        </Button>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Autenticação validada. O shell completo do painel (sidebar, dashboard, etc.) vem na
          próxima etapa.
        </p>
      </main>
    </div>
  );
}
