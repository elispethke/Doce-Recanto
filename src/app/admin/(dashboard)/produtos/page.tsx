"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/features/admin/shared/components/confirm-dialog";
import { ProductsTable } from "@/features/admin/products/components/products-table";
import { ProductFormDialog } from "@/features/admin/products/components/product-form-dialog";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { removeAdminProduct } from "@/services/firestore/products-admin.service";
import type { AdminProductDoc } from "@/types/firebase-models";

export default function AdminProductsPage() {
  const { products, productsLoading } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductDoc | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProductDoc | null>(null);

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: AdminProductDoc) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {productsLoading ? "Carregando..." : `${products.length} produto${products.length === 1 ? "" : "s"} cadastrado${products.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" /> Novo produto
        </Button>
      </div>

      <ProductsTable products={products} loading={productsLoading} onEdit={openEdit} onDelete={setDeletingProduct} />

      <ProductFormDialog product={editingProduct} open={formOpen} onOpenChange={setFormOpen} />
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${deletingProduct?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={async () => {
          if (!deletingProduct) return;
          try {
            await removeAdminProduct(deletingProduct.id);
            toast.success("Produto excluído.");
          } catch {
            toast.error("Não foi possível excluir o produto.");
          }
        }}
      />
    </div>
  );
}
