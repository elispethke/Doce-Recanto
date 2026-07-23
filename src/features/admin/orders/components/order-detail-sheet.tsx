"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Phone, Truck, User } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { AssignDriverDialog } from "@/features/admin/orders/components/assign-driver-dialog";
import { AdminOrderChat } from "@/features/admin/chat/components/admin-order-chat";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { updateOrderStatus } from "@/services/firestore/orders-admin.service";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META, PAYMENT_METHOD_LABELS } from "@/features/admin/shared/lib/order-status";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { OrderDoc, OrderStatus } from "@/types/firebase-models";

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  initialTab = "detalhes",
}: {
  order: OrderDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "detalhes" | "chat";
}) {
  const { drivers } = useAdminData();
  const [assignOpen, setAssignOpen] = useState(false);
  const driver = drivers.find((d) => d.id === order?.driverId);

  async function handleStatusChange(value: OrderStatus) {
    if (!order) return;
    try {
      await updateOrderStatus(order.id, value);
      toast.success(`Status atualizado para "${ORDER_STATUS_META[value].label}"`);
    } catch {
      toast.error("Não foi possível atualizar o status.");
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
          {order && (
            <Tabs key={order.id} defaultValue={initialTab} className="flex min-h-0 flex-1 flex-col gap-0">
              <SheetHeader className="border-b border-border">
                <div className="flex items-center justify-between gap-2">
                  <SheetTitle>{formatOrderId(order.id)}</SheetTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
                <SheetDescription>
                  {order.createdAt?.toDate?.() &&
                    format(order.createdAt.toDate(), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </SheetDescription>
                <TabsList className="mt-2 w-fit">
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </SheetHeader>

              <TabsContent value="detalhes" className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-5 p-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Alterar status</p>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(value as OrderStatus)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS_FLOW.map((status) => (
                        <SelectItem key={status} value={status}>
                          {ORDER_STATUS_META[status].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-xl bg-muted/50 p-3.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <User className="size-3.5 text-muted-foreground" /> {order.customerName}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5" /> {order.customerPhone}
                  </div>
                  <div className="mt-1.5 flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" /> {order.address}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="size-3.5" />
                    {driver ? driver.name : "Sem motorista atribuído"}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
                    {driver ? "Trocar" : "Atribuir"}
                  </Button>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Produtos</p>
                  <div className="flex flex-col gap-2.5">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.image && (
                            <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity}× {formatBRL(item.price)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatBRL(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="rounded-xl bg-muted/50 p-3.5 text-sm text-muted-foreground">
                    <p className="mb-1 text-xs font-medium text-foreground">Observações</p>
                    {order.notes}
                  </div>
                )}

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatBRL(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Entrega</span>
                    <span>{formatBRL(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pagamento</span>
                    <span>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatBRL(order.total)}</span>
                  </div>
                </div>
              </div>
              </TabsContent>

              <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col">
                <AdminOrderChat order={order} />
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      <AssignDriverDialog order={order} open={assignOpen} onOpenChange={setAssignOpen} />
    </>
  );
}
