"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { createCalendarEvent } from "@/services/firestore/calendar-events.service";

const schema = z.object({
  title: z.string().trim().min(2, "Informe um título"),
  date: z.string().min(1, "Informe uma data"),
  notes: z.string().trim().optional(),
});

type Schema = z.infer<typeof schema>;

export function CalendarEventDialog({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: zodResolver(schema), defaultValues: { title: "", date: defaultDate, notes: "" } });

  useEffect(() => {
    if (open) reset({ title: "", date: defaultDate, notes: "" });
  }, [open, defaultDate, reset]);

  async function onSubmit(data: Schema) {
    try {
      await createCalendarEvent({ title: data.title, type: "importante", date: data.date, notes: data.notes });
      toast.success("Data importante adicionada.");
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível salvar a data.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova data importante</DialogTitle>
          <DialogDescription>Feriados, promoções ou lembretes visíveis no calendário.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-title">Título</Label>
            <Input id="event-title" placeholder="Ex: Dia das Mães" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-date">Data</Label>
            <Input id="event-date" type="date" {...register("date")} />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-notes">Notas (opcional)</Label>
            <Textarea id="event-notes" placeholder="Detalhes adicionais..." {...register("notes")} />
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
