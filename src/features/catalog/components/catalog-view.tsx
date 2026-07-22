"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CategoryTabs } from "@/features/catalog/components/category-tabs";
import { SortSelect } from "@/features/catalog/components/sort-select";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { fetchProducts, type ProductQuery } from "@/services/products.service";
import type { Product, ProductCategory } from "@/types/product";

export function CatalogView({
  initialCategory,
  initialSearch,
}: {
  initialCategory: ProductCategory | "todos";
  initialSearch: string;
}) {
  const [category, setCategory] = useState<ProductCategory | "todos">(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<NonNullable<ProductQuery["sort"]>>("relevancia");
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let active = true;
    const isPromo = category === "promocoes";
    fetchProducts({ search, sort, category: isPromo ? "todos" : category }).then((result) => {
      if (!active) return;
      setProducts(isPromo ? result.filter((p) => p.originalPrice) : result);
    });
    return () => {
      active = false;
    };
  }, [category, search, sort]);

  const loading = products === null;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Loja</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Buscando produtos..." : `${products.length} produtos encontrados`}
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Buscar bolos, doces e mais..."
          className="h-11 w-full rounded-full border border-transparent bg-secondary/60 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-3 focus:ring-primary/15"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryTabs active={category} onChange={setCategory} />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-secondary/50" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
