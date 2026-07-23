import { AppShell } from "@/components/layout/app-shell";
import { HeroBanner } from "@/features/home/components/hero-banner";
import { CategoryPills } from "@/features/home/components/category-pills";
import { SectionHeader } from "@/features/home/components/section-header";
import { BenefitsStrip } from "@/features/home/components/benefits-strip";
import { Testimonials } from "@/features/home/components/testimonials";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import {
  fetchHighlightedProducts,
  fetchBestSellers,
  fetchPromotions,
} from "@/services/products.service";

export default async function Home() {
  const [highlighted, bestSellers, promotions] = await Promise.all([
    fetchHighlightedProducts(8),
    fetchBestSellers(4),
    fetchPromotions(4),
  ]);

  return (
    <AppShell>
      <div className="flex flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <HeroBanner />
        <CategoryPills />

        <section>
          <SectionHeader title="Destaques para você" href="/loja" />
          <ProductGrid products={highlighted} />
        </section>

        <section>
          <SectionHeader title="Mais vendidos" href="/loja" />
          <ProductGrid products={bestSellers} />
        </section>

        {promotions.length > 0 && (
          <section>
            <SectionHeader title="Promoções" href="/loja?categoria=promocoes" />
            <ProductGrid products={promotions} />
          </section>
        )}

        <section className="rounded-3xl bg-secondary/30 p-6 sm:p-10">
          <SectionHeader title="O que dizem nossos clientes" />
          <Testimonials />
        </section>

        <BenefitsStrip />
      </div>
    </AppShell>
  );
}
