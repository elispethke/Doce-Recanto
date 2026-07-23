import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProductGallery } from "@/features/product/components/product-gallery";
import { ProductInfo } from "@/features/product/components/product-info";
import { RelatedProducts } from "@/features/product/components/related-products";
import { fetchProductBySlug, fetchRelatedProducts } from "@/services/products.service";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await fetchRelatedProducts(product);

  return (
    <AppShell>
      <div className="flex flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
        <RelatedProducts products={related} />
      </div>
    </AppShell>
  );
}
