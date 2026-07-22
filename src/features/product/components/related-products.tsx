import { SectionHeader } from "@/features/home/components/section-header";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Você também pode gostar" />
      <ProductGrid products={products} />
    </section>
  );
}
