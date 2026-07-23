"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFinancialEntry } from "@/services/firestore/financial-entries.service";
import { format } from "date-fns";
import type { FinancialEntryType } from "@/types/firebase-models";

const schema = z.object({
  type: z.enum(["entrada", "saida"]),
  description: z.string().trim().min(2, "Descreva o lançamento"),
  amount: z
    .string()
    .min(1, "Informe um valor")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, "Informe um valor válido"),
  category: z.string().trim().optional(),
  date: z.string().min(1, "Informe uma data"),
});

type Schema = z.infer<typeof schema>;

export function FinancialEntryDialog({
  open,
  onOpenChange,
  defaultType = "entrada",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: FinancialEntryType;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      description: "",
      amount: "",
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  async function onSubmit(data: Schema) {
    try {
      await createFinancialEntry({
        type: data.type,
        description: data.description,
        amount: Number(data.amount),
        category: data.category || undefined,
        date: data.date,
      });
      toast.success(data.type === "entrada" ? "Entrada registrada." : "Saída registrada.");
      onOpenChange(false);
      reset();
    } catch {
      toast.error("Não foi possível salvar o lançamento.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
          <DialogDescription>Registre uma entrada ou saída do caixa.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Tabs value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                <TabsList className="w-full">
                  <TabsTrigger value="entrada" className="flex-1">
                    Entrada
                  </TabsTrigger>
                  <TabsTrigger value="saida" className="flex-1">
                    Saída
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entry-description">Descrição</Label>
            <Input id="entry-description" placeholder="Ex: Compra de ingredientes" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="entry-amount">Valor</Label>
              <Input id="entry-amount" type="number" step="0.01" min="0" placeholder="0,00" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="entry-date">Data</Label>
              <Input id="entry-date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entry-category">Categoria (opcional)</Label>
            <Input id="entry-category" placeholder="Ex: Ingredientes, Aluguel, Marketing..." {...register("category")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
