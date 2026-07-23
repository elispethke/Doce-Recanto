"use client";

import { CalendarDays, CalendarRange, Wallet, TrendingUp } from "lucide-react";
import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { computeFinancialSummary } from "@/features/admin/financial/lib/financial-aggregate";
import { formatBRL } from "@/lib/format";

export function FinancialSummary() {
  const { orders, ordersLoading } = useAdminData();
  const summary = computeFinancialSummary(orders);

  const cards = [
    { label: "Receita diária", value: formatBRL(summary.receitaDiaria), icon: Wallet, accent: "emerald" as const },
    { label: "Receita semanal", value: formatBRL(summary.receitaSemanal), icon: CalendarDays, accent: "blue" as const },
    { label: "Receita mensal", value: formatBRL(summary.receitaMensal), icon: CalendarRange, accent: "violet" as const },
    { label: "Receita total", value: formatBRL(summary.receitaTotal), icon: TrendingUp, accent: "primary" as const },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} loading={ordersLoading} index={index} />
      ))}
    </div>
  );
}
