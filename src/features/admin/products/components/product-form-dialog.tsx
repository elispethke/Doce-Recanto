"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminProduct, updateAdminProduct } from "@/services/firestore/products-admin.service";
import { productSchema, type ProductSchema } from "@/features/admin/products/schema/product-schema";
import { categories } from "@/data/categories";
import type { AdminProductDoc } from "@/types/firebase-models";

export function ProductFormDialog({
  product,
  open,
  onOpenChange,
}: {
  product: AdminProductDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", category: "", price: "", available: true, imageUrl: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name,
              category: product.category,
              price: String(product.price),
              available: product.available,
              imageUrl: product.imageUrl,
              description: product.description ?? "",
            }
          : { name: "", category: "", price: "", available: true, imageUrl: "", description: "" }
      );
    }
  }, [open, product, reset]);

  async function onSubmit(data: ProductSchema) {
    try {
      const input = { ...data, price: Number(data.price), description: data.description || undefined };
      if (product) {
        await updateAdminProduct(product.id, input);
        toast.success("Produto atualizado.");
      } else {
        await createAdminProduct(input);
        toast.success("Produto criado.");
      }
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível salvar o produto.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            {product ? "Atualize as informações do produto." : "Cadastre um novo produto no catálogo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-name">Nome</Label>
            <Input id="product-name" placeholder="Ex: Bolo de Chocolate" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Categoria</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-price">Preço</Label>
              <Input id="product-price" type="number" step="0.01" min="0" {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-image">URL da imagem</Label>
            <Input id="product-image" placeholder="https://..." {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-description">Descrição (opcional)</Label>
            <Textarea id="product-description" placeholder="Detalhes do produto..." {...register("description")} />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
            <Label htmlFor="product-available">Disponível para venda</Label>
            <Controller
              control={control}
              name="available"
              render={({ field }) => (
                <Switch id="product-available" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
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
