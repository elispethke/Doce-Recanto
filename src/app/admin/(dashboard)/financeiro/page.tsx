"use client";

import { FinancialSummary } from "@/features/admin/financial/components/financial-summary";
import { FinancialEntriesSection } from "@/features/admin/financial/components/financial-entries-section";
import { PaymentBreakdownChart } from "@/features/admin/financial/components/payment-breakdown-chart";
import { RevenueChart } from "@/features/admin/dashboard/components/revenue-chart";
import { RevenueEvolutionChart } from "@/features/admin/dashboard/components/revenue-evolution-chart";
import { Separator } from "@/components/ui/separator";

export default function AdminFinancialPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Receita, formas de pagamento e crescimento da loja.</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Receita de pedidos</p>
        <FinancialSummary />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueChart />
        <PaymentBreakdownChart />
      </div>

      <RevenueEvolutionChart />

      <Separator />

      <FinancialEntriesSection />
    </div>
  );
}
