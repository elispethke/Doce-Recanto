"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/features/admin/dashboard/components/dashboard-stats";
import { RevenueChart } from "@/features/admin/dashboard/components/revenue-chart";
import { PaymentMethodChart } from "@/features/admin/dashboard/components/payment-method-chart";
import { RevenueEvolutionChart } from "@/features/admin/dashboard/components/revenue-evolution-chart";
import { ActivityFeed } from "@/features/admin/dashboard/components/activity-feed";
import { DispatchBoard } from "@/features/admin/dispatch/components/dispatch-board";

export default function AdminDashboardPage() {
  const { adminProfile } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Olá, {adminProfile?.name?.split(" ")[0] ?? "administrador"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está o resumo da loja em tempo real.</p>
      </div>

      <DashboardStats />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Atribuição de pedidos</CardTitle>
            <p className="text-sm text-muted-foreground">Arraste um pedido para um motorista para atribuí-lo.</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5" nativeButton={false} render={<Link href="/admin/pedidos" />}>
            Ver pedidos <ArrowUpRight className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <DispatchBoard />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <PaymentMethodChart />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityFeed />
        </div>
        <RevenueEvolutionChart />
      </div>
    </div>
  );
}
