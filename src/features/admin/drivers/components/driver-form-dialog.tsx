"use client";

import { Controller, useForm, type Control, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDriver, updateDriver } from "@/services/firestore/drivers.service";
import {
  driverCreateSchema,
  driverEditSchema,
  type DriverCreateSchema,
  type DriverEditSchema,
} from "@/features/admin/drivers/schema/driver-schema";
import { DRIVER_STATUS_META, DRIVER_STATUS_OPTIONS } from "@/features/admin/shared/lib/driver-status";
import type { DriverDoc, DriverStatus } from "@/types/firebase-models";

function StatusField<T extends FieldValues & { status: DriverStatus }>({ control }: { control: Control<T> }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Status</Label>
      <Controller
        control={control}
        name={"status" as Path<T>}
        render={({ field }) => (
          <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
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
        )}
      />
    </div>
  );
}

function CreateDriverForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverCreateSchema>({
    resolver: zodResolver(driverCreateSchema),
    defaultValues: { name: "", phone: "", photoUrl: "", status: "disponivel", email: "", password: "" },
  });

  async function onSubmit(data: DriverCreateSchema) {
    try {
      await createDriver({ ...data, photoUrl: data.photoUrl || undefined });
      toast.success("Motorista cadastrado. Ele já pode logar no app com esse e-mail e senha.");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o motorista.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-name">Nome</Label>
        <Input id="driver-name" placeholder="Nome completo" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-email">E-mail de acesso</Label>
        <Input id="driver-email" type="email" placeholder="motorista@doceencanto.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        <p className="text-xs text-muted-foreground">Usado futuramente para login no app do motorista.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-password">Senha de acesso</Label>
        <Input id="driver-password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-phone">Telefone</Label>
        <Input id="driver-phone" placeholder="(11) 99999-9999" {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-photo">URL da foto (opcional)</Label>
        <Input id="driver-photo" placeholder="https://..." {...register("photoUrl")} />
        {errors.photoUrl && <p className="text-xs text-destructive">{errors.photoUrl.message}</p>}
      </div>

      <StatusField control={control} />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}

function EditDriverForm({
  driver,
  onSaved,
  onCancel,
}: {
  driver: DriverDoc;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverEditSchema>({
    resolver: zodResolver(driverEditSchema),
    defaultValues: {
      name: driver.name,
      phone: driver.phone,
      photoUrl: driver.photoUrl ?? "",
      status: driver.status,
    },
  });

  async function onSubmit(data: DriverEditSchema) {
    try {
      await updateDriver(driver.id, { ...data, photoUrl: data.photoUrl || undefined });
      toast.success("Motorista atualizado.");
      onSaved();
    } catch {
      toast.error("Não foi possível salvar o motorista.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-name">Nome</Label>
        <Input id="driver-name" placeholder="Nome completo" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>E-mail de acesso</Label>
        <Input value={driver.email} disabled />
        <p className="text-xs text-muted-foreground">O e-mail de login não pode ser alterado por aqui.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-phone">Telefone</Label>
        <Input id="driver-phone" placeholder="(11) 99999-9999" {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="driver-photo">URL da foto (opcional)</Label>
        <Input id="driver-photo" placeholder="https://..." {...register("photoUrl")} />
        {errors.photoUrl && <p className="text-xs text-destructive">{errors.photoUrl.message}</p>}
      </div>

      <StatusField control={control} />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}

export function DriverFormDialog({
  driver,
  open,
  onOpenChange,
}: {
  driver: DriverDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{driver ? "Editar motorista" : "Novo motorista"}</DialogTitle>
          <DialogDescription>
            {driver ? "Atualize os dados do motorista." : "Cadastre o motorista e a conta que ele vai usar para logar no app."}
          </DialogDescription>
        </DialogHeader>

        {driver ? (
          <EditDriverForm key={driver.id} driver={driver} onSaved={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
        ) : (
          <CreateDriverForm key="create" onSaved={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
