"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/customer/account/components/order-status-badge";
import { fetchCustomerOrders } from "@/services/orders.service";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { OrderDoc } from "@/types/firebase-models";

export function OrdersList({ limit }: { limit?: number }) {
  const { user } = useCustomerAuth();
  const [orders, setOrders] = useState<OrderDoc[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchCustomerOrders(user.uid).then(setOrders);
  }, [user]);

  if (orders === null) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-secondary/50" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center ring-1 ring-foreground/[0.06]">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Package className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>
        <Button size="sm" nativeButton={false} render={<Link href="/loja" />}>
          Ver produtos
        </Button>
      </div>
    );
  }

  const displayed = limit ? orders.slice(0, limit) : orders;

  return (
    <div className="flex flex-col gap-3">
      {displayed.map((order) => (
        <Link
          key={order.id}
          href={`/pedido/${order.id}/acompanhar`}
          className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.06] transition-shadow hover:shadow-md"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-secondary/50">
            {order.items[0] && (
              <Image src={order.items[0].image} alt="" fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{formatOrderId(order.id)}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {order.items.map((item) => item.name).join(", ")}
            </p>
          </div>
          <span className="shrink-0 font-heading text-sm font-semibold text-primary">
            {formatBRL(order.total)}
          </span>
        </Link>
      ))}
    </div>
  );
}
