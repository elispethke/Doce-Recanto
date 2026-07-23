"use client";

import {
  CalendarClock,
  ChefHat,
  CircleCheck,
  Clock4,
  DollarSign,
  Receipt,
  Truck,
  Users,
} from "lucide-react";
import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { computeDashboardStats } from "@/features/admin/dashboard/lib/aggregate";
import { formatBRL } from "@/lib/format";

export function DashboardStats() {
  const { orders, ordersLoading, customers, customersLoading } = useAdminData();
  const stats = computeDashboardStats(orders, customers.length);
  const loading = ordersLoading || customersLoading;

  const cards = [
    { label: "Pedidos do dia", value: String(stats.pedidosHoje), icon: CalendarClock, accent: "blue" as const },
    { label: "Em produção", value: String(stats.emProducao), icon: ChefHat, accent: "amber" as const },
    { label: "Aguardando motorista", value: String(stats.aguardandoMotorista), icon: Clock4, accent: "violet" as const },
    { label: "Em entrega", value: String(stats.emEntrega), icon: Truck, accent: "violet" as const },
    { label: "Concluídos hoje", value: String(stats.concluidosHoje), icon: CircleCheck, accent: "emerald" as const },
    { label: "Receita do dia", value: formatBRL(stats.receitaHoje), icon: DollarSign, accent: "emerald" as const },
    { label: "Ticket médio", value: formatBRL(stats.ticketMedio), icon: Receipt, accent: "primary" as const },
    { label: "Clientes cadastrados", value: String(stats.clientesCadastrados), icon: Users, accent: "blue" as const },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} loading={loading} index={index} />
      ))}
    </div>
  );
}
