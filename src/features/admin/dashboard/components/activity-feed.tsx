"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { OrderDoc } from "@/types/firebase-models";

type FeedTab = "recentes" | "producao" | "motorista" | "entrega" | "movimentacoes";

const tabs: { value: FeedTab; label: string }[] = [
  { value: "recentes", label: "Últimos pedidos" },
  { value: "producao", label: "Em produção" },
  { value: "motorista", label: "Aguardando" },
  { value: "entrega", label: "Em entrega" },
  { value: "movimentacoes", label: "Movimentações" },
];

function timeAgo(order: OrderDoc, field: "createdAt" | "updatedAt") {
  const date = order[field]?.toDate?.();
  if (!date) return "agora";
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

function ActivityRow({ order, field = "createdAt" }: { order: OrderDoc; field?: "createdAt" | "updatedAt" }) {
  return (
    <Link
      href={`/admin/pedidos?pedido=${order.id}`}
      className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{formatOrderId(order.id)}</p>
          <span className="truncate text-xs text-muted-foreground">{order.customerName}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(order, field)}</p>
      </div>
      <span className="shrink-0 text-sm font-medium text-foreground">{formatBRL(order.total)}</span>
      <OrderStatusBadge status={order.status} className="shrink-0" />
    </Link>
  );
}

export function ActivityFeed() {
  const { orders, ordersLoading } = useAdminData();
  const [tab, setTab] = useState<FeedTab>("recentes");

  const list = useMemo(() => {
    switch (tab) {
      case "producao":
        return orders.filter((o) => o.status === "em-producao");
      case "motorista":
        return orders.filter((o) => o.status === "aguardando-motorista");
      case "entrega":
        return orders.filter((o) => o.status === "em-entrega");
      case "movimentacoes":
        return [...orders].sort((a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0)).slice(0, 8);
      default:
        return orders.slice(0, 8);
    }
  }, [orders, tab]);

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Atividade em tempo real</CardTitle>
        <Tabs value={tab} onValueChange={(value) => setTab(value as FeedTab)}>
          <TabsList className="flex-wrap">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ordersLoading ? (
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)
        ) : list.length === 0 ? (
          <EmptyState icon={Activity} title="Nada por aqui ainda" className="border-none py-10" />
        ) : (
          list.map((order) => (
            <ActivityRow key={order.id} order={order} field={tab === "movimentacoes" ? "updatedAt" : "createdAt"} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
