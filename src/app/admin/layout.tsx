import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata = {
  title: "Painel Administrativo — Doce Encanto",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-theme min-h-screen bg-background font-sans text-foreground">
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: "font-sans",
        }}
      />
    </div>
  );
}
