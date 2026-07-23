"use client";

import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DriverStatusBadge } from "@/features/admin/shared/components/status-badge";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { assignDriverToOrder } from "@/services/firestore/orders-admin.service";
import { formatOrderId } from "@/lib/format";
import type { OrderDoc } from "@/types/firebase-models";

export function AssignDriverDialog({
  order,
  open,
  onOpenChange,
}: {
  order: OrderDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { drivers } = useAdminData();
  const [driverId, setDriverId] = useState<string>(order?.driverId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!order || !driverId) return;
    setLoading(true);
    try {
      await assignDriverToOrder(order.id, driverId);
      const driver = drivers.find((d) => d.id === driverId);
      toast.success(`${formatOrderId(order.id)} atribuído a ${driver?.name ?? "motorista"}`);
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível atribuir o motorista.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir motorista</DialogTitle>
          <DialogDescription>
            {order && `Selecione o motorista responsável pelo pedido ${formatOrderId(order.id)}.`}
          </DialogDescription>
        </DialogHeader>

        <Select value={driverId} onValueChange={(value) => setDriverId(value ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha um motorista" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                <span className="flex w-full items-center justify-between gap-2">
                  {driver.name}
                  <DriverStatusBadge status={driver.status} />
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!driverId || loading} className="gap-1.5">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Truck className="size-3.5" />}
            Atribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
