"use client";

import Image from "next/image";
import { MoreHorizontal, Package, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { categories } from "@/data/categories";
import { formatBRL } from "@/lib/format";
import type { AdminProductDoc } from "@/types/firebase-models";

export function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
}: {
  products: AdminProductDoc[];
  loading: boolean;
  onEdit: (product: AdminProductDoc) => void;
  onDelete: (product: AdminProductDoc) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState icon={Package} title="Nenhum produto cadastrado" description="Adicione o primeiro produto ao catálogo." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.imageUrl && <Image src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" />}
                  </div>
                  <span className="font-medium text-foreground">{product.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {categories.find((c) => c.slug === product.category)?.name ?? product.category}
              </TableCell>
              <TableCell className="font-medium text-foreground">{formatBRL(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.available ? "default" : "outline"}>
                  {product.available ? "Disponível" : "Indisponível"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Pencil className="size-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(product)}>
                      <Trash2 className="size-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
