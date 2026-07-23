"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { fetchProductsByIds } from "@/services/products.service";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import type { Product } from "@/types/product";

export function FavoritesGrid() {
  const { profile } = useCustomerAuth();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    fetchProductsByIds(profile.favoriteProductIds).then(setProducts);
  }, [profile]);

  if (products === null) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-secondary/50" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center ring-1 ring-foreground/[0.06]">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Heart className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">Você ainda não favoritou nenhum produto.</p>
        <Button size="sm" nativeButton={false} render={<Link href="/loja" />}>
          Ver produtos
        </Button>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
