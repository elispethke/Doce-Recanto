"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { addressSchema, type AddressSchema } from "@/features/customer/account/schema/address-schema";
import type { AddressDoc } from "@/types/firebase-models";

export function AddressForm({
  initialValue,
  onSubmit,
  onCancel,
}: {
  initialValue?: AddressDoc;
  onSubmit: (data: AddressSchema) => Promise<void>;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValue ?? { label: "", street: "", number: "", city: "", zip: "" },
  });

  async function handleFormSubmit(data: AddressSchema) {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label">Nome do endereço</Label>
        <Input id="label" placeholder="Casa, Trabalho..." {...register("label")} />
        {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="street">Endereço</Label>
          <Input id="street" placeholder="Rua, avenida..." {...register("street")} />
          {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="number">Número</Label>
          <Input id="number" placeholder="123" {...register("number")} />
          {errors.number && <p className="text-xs text-destructive">{errors.number.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="complement">Complemento (opcional)</Label>
          <Input id="complement" placeholder="Apto, bloco..." {...register("complement")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" placeholder="São Paulo" {...register("city")} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zip">CEP</Label>
          <Input id="zip" placeholder="01310-100" {...register("zip")} />
          {errors.zip && <p className="text-xs text-destructive">{errors.zip.message}</p>}
        </div>
      </div>

      <Controller
        control={control}
        name="isDefault"
        render={({ field }) => (
          <label className="flex w-fit items-center gap-2 text-sm text-foreground">
            <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
            Definir como endereço padrão
          </label>
        )}
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-full">
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting} className="rounded-full">
          {submitting ? <Loader2 className="size-4 animate-spin" /> : "Salvar endereço"}
        </Button>
      </div>
    </form>
  );
}
