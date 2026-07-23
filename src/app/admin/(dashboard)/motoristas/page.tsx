"use client";

import { useState } from "react";
import { Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { ConfirmDialog } from "@/features/admin/shared/components/confirm-dialog";
import { DriverCard } from "@/features/admin/drivers/components/driver-card";
import { DriverFormDialog } from "@/features/admin/drivers/components/driver-form-dialog";
import { DriverDetailSheet } from "@/features/admin/drivers/components/driver-detail-sheet";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { removeDriver } from "@/services/firestore/drivers.service";
import type { DriverDoc } from "@/types/firebase-models";

export default function AdminDriversPage() {
  const { drivers, driversLoading, orders } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverDoc | null>(null);
  const [detailDriver, setDetailDriver] = useState<DriverDoc | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deletingDriver, setDeletingDriver] = useState<DriverDoc | null>(null);

  function openCreate() {
    setEditingDriver(null);
    setFormOpen(true);
  }

  function openEdit(driver: DriverDoc) {
    setEditingDriver(driver);
    setFormOpen(true);
  }

  function openDetail(driver: DriverDoc) {
    setDetailDriver(driver);
    setDetailOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Motoristas</h1>
          <p className="text-sm text-muted-foreground">
            {driversLoading ? "Carregando..." : `${drivers.length} motorista${drivers.length === 1 ? "" : "s"} cadastrado${drivers.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" /> Novo motorista
        </Button>
      </div>

      {driversLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : drivers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Nenhum motorista cadastrado"
          description="Cadastre o primeiro motorista para começar a atribuir entregas."
          action={
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="size-3.5" /> Novo motorista
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver, index) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              activeOrders={orders.filter((o) => o.driverId === driver.id && o.status === "em-entrega").length}
              onOpen={() => openDetail(driver)}
              onEdit={() => openEdit(driver)}
              onDelete={() => setDeletingDriver(driver)}
              index={index}
            />
          ))}
        </div>
      )}

      <DriverFormDialog driver={editingDriver} open={formOpen} onOpenChange={setFormOpen} />
      <DriverDetailSheet driver={detailDriver} open={detailOpen} onOpenChange={setDetailOpen} />
      <ConfirmDialog
        open={Boolean(deletingDriver)}
        onOpenChange={(open) => !open && setDeletingDriver(null)}
        title="Remover motorista"
        description={`Tem certeza que deseja remover ${deletingDriver?.name}? Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={async () => {
          if (!deletingDriver) return;
          try {
            await removeDriver(deletingDriver.id);
            toast.success("Motorista removido.");
          } catch {
            toast.error("Não foi possível remover o motorista.");
          }
        }}
      />
    </div>
  );
}
