"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { Truck } from "lucide-react";
import { DispatchColumn } from "@/features/admin/dispatch/components/dispatch-column";
import { DispatchOrderCard } from "@/features/admin/dispatch/components/dispatch-order-card";
import { DriverStatusBadge } from "@/features/admin/shared/components/status-badge";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { assignDriverToOrder, unassignDriverFromOrder } from "@/services/firestore/orders-admin.service";
import { formatOrderId } from "@/lib/format";

const UNASSIGNED_COLUMN_ID = "unassigned";

export function DispatchBoard() {
  const { orders, ordersLoading, drivers, driversLoading } = useAdminData();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const unassigned = orders.filter((o) => o.status === "aguardando-motorista");
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveOrderId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveOrderId(null);
    const { active, over } = event;
    if (!over) return;

    const orderId = String(active.id);
    const targetId = String(over.id);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    try {
      if (targetId === UNASSIGNED_COLUMN_ID) {
        if (order.driverId) await unassignDriverFromOrder(orderId);
        return;
      }

      if (order.driverId === targetId) return;
      const driver = drivers.find((d) => d.id === targetId);
      if (!driver) return;

      await assignDriverToOrder(orderId, targetId);
      toast.success(`${formatOrderId(orderId)} atribuído a ${driver.name}`, {
        description: "Status atualizado para \"Em entrega\".",
      });
    } catch {
      toast.error("Não foi possível atualizar a atribuição.");
    }
  }

  if (ordersLoading || driversLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 w-72 shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="Nenhum motorista cadastrado"
        description="Cadastre motoristas na tela de Motoristas para começar a atribuir pedidos."
      />
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        <DispatchColumn
          id={UNASSIGNED_COLUMN_ID}
          title="Aguardando motorista"
          badge={
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
              {unassigned.length}
            </span>
          }
          orders={unassigned}
          emptyLabel="Nenhum pedido aguardando"
        />

        {drivers
          .filter((driver) => driver.status !== "desligado")
          .map((driver) => {
            const driverOrders = orders.filter(
              (o) => o.driverId === driver.id && o.status === "em-entrega"
            );
            return (
              <DispatchColumn
                key={driver.id}
                id={driver.id}
                title={driver.name}
                badge={<DriverStatusBadge status={driver.status} />}
                orders={driverOrders}
                emptyLabel="Arraste um pedido aqui"
              />
            );
          })}
      </div>

      <DragOverlay>{activeOrder && <DispatchOrderCard order={activeOrder} overlay />}</DragOverlay>
    </DndContext>
  );
}
