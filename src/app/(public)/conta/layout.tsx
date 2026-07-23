import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AccountGuard } from "@/features/customer/account/components/account-guard";
import { AccountNav } from "@/features/customer/account/components/account-nav";

export default function ContaLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell showCartPanel={false}>
      <AccountGuard>
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <AccountNav />
          {children}
        </div>
      </AccountGuard>
    </AppShell>
  );
}
