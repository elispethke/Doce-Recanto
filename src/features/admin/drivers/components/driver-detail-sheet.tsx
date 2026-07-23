"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Truck } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { updateDriverStatus } from "@/services/firestore/drivers.service";
import { DRIVER_STATUS_META, DRIVER_STATUS_OPTIONS } from "@/features/admin/shared/lib/driver-status";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { DriverDoc, DriverStatus } from "@/types/firebase-models";

export function DriverDetailSheet({
  driver,
  open,
  onOpenChange,
}: {
  driver: DriverDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { orders } = useAdminData();

  const driverOrders = useMemo(
    () =>
      orders
        .filter((order) => order.driverId === driver?.id)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)),
    [orders, driver]
  );
  const activeOrders = driverOrders.filter((o) => o.status === "em-entrega").length;

  async function handleStatusChange(value: DriverStatus) {
    if (!driver) return;
    try {
      await updateDriverStatus(driver.id, value);
      toast.success(`Status atualizado para "${DRIVER_STATUS_META[value].label}"`);
    } catch {
      toast.error("Não foi possível atualizar o status.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {driver && (
          <>
            <SheetHeader className="items-center border-b border-border text-center">
              <Avatar size="lg" className="size-16">
                <AvatarImage src={driver.photoUrl} alt={driver.name} />
                <AvatarFallback className="bg-primary/10 text-lg text-primary">
                  {driver.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <SheetTitle>{driver.name}</SheetTitle>
              <SheetDescription className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {driver.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {driver.email}
                </span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 p-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Disponibilidade</p>
                <Select value={driver.status} onValueChange={(value) => value && handleStatusChange(value as DriverStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVER_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {DRIVER_STATUS_META[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3.5 text-center">
                  <p className="font-heading text-xl font-semibold text-foreground">{activeOrders}</p>
                  <p className="text-xs text-muted-foreground">Pedidos ativos</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3.5 text-center">
                  <p className="font-heading text-xl font-semibold text-foreground">{driverOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Total de entregas</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Histórico de pedidos</p>
                {driverOrders.length === 0 ? (
                  <EmptyState icon={Truck} title="Nenhum pedido ainda" className="border-none py-8" />
                ) : (
                  <div className="flex flex-col gap-2">
                    {driverOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{formatOrderId(order.id)}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.createdAt?.toDate?.() &&
                              format(order.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
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
