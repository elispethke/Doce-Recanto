"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderTrackingTimeline } from "@/features/order/components/order-tracking-timeline";
import { OrderChat } from "@/features/order/components/order-chat";
import { fetchOrder, updateOrderStatus } from "@/services/orders.service";
import { formatOrderId } from "@/lib/format";
import type { Order } from "@/types/order";

export function OrderTrackingView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    fetchOrder(orderId).then((result) => setOrder(result ?? null));
  }, [orderId]);

  useEffect(() => {
    if (!order || order.status !== "recebido") return;
    const timer = window.setTimeout(async () => {
      await updateOrderStatus(order.id, "preparando");
      const updated = await fetchOrder(order.id);
      if (updated) setOrder(updated);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [order]);

  if (order === undefined) {
    return <div className="py-24 text-center text-sm text-muted-foreground">Carregando pedido...</div>;
  }

  if (order === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Não encontramos esse pedido.</p>
        <Button nativeButton={false} render={<Link href="/loja" />}>Voltar à loja</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-primary">Acompanhar pedido</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Pedido {formatOrderId(order.id)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Previsão de entrega às {order.estimatedDelivery}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]">
          <h2 className="mb-6 font-heading text-lg font-semibold text-foreground">Status do pedido</h2>
          <OrderTrackingTimeline status={order.status} />
        </div>

        <OrderChat orderId={order.id} />
      </div>
    </div>
  );
}
