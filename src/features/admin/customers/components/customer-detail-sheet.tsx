"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, MapPin, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { formatBRL, formatOrderId } from "@/lib/format";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import type { CustomerRow } from "@/features/admin/customers/components/customers-table";

export function CustomerDetailSheet({
  row,
  open,
  onOpenChange,
}: {
  row: CustomerRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { orders } = useAdminData();
  const customerOrders = row
    ? orders
        .filter((order) => order.customerId === row.customer.id)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {row && (
          <>
            <SheetHeader className="items-center border-b border-border text-center">
              <Avatar size="lg" className="size-16">
                <AvatarFallback className="bg-primary/10 text-lg text-primary">
                  {row.customer.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <SheetTitle>{row.customer.name}</SheetTitle>
              <SheetDescription className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {row.customer.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {row.customer.phone}
                </span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 p-4">
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={customerOrders.length === 0}
                nativeButton={customerOrders.length === 0}
                render={
                  customerOrders.length > 0 ? (
                    <Link href={`/admin/pedidos?pedido=${customerOrders[0].id}&aba=chat`} />
                  ) : undefined
                }
              >
                <MessageCircle className="size-4" /> Abrir chat com o cliente
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3.5 text-center">
                  <p className="font-heading text-xl font-semibold text-foreground">{row.orderCount}</p>
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3.5 text-center">
                  <p className="font-heading text-xl font-semibold text-foreground">{formatBRL(row.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">Total gasto</p>
                </div>
              </div>

              {row.customer.addresses.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Endereços</p>
                  <div className="flex flex-col gap-2">
                    {row.customer.addresses.map((address) => (
                      <div key={address.id} className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 size-3.5 shrink-0" />
                        <span>
                          {address.street}, {address.number}
                          {address.complement ? ` - ${address.complement}` : ""} — {address.city}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Histórico de pedidos</p>
                {customerOrders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title="Nenhum pedido ainda" className="border-none py-8" />
                ) : (
                  <div className="flex flex-col gap-2">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{formatOrderId(order.id)}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.createdAt?.toDate?.() && format(order.createdAt.toDate(), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{formatBRL(order.total)}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
