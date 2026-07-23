import { AppShell } from "@/components/layout/app-shell";
import { CatalogView } from "@/features/catalog/components/catalog-view";
import type { ProductCategory } from "@/types/product";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = (params.categoria as ProductCategory | undefined) ?? "todos";
  const initialSearch = params.busca ?? "";

  return (
    <AppShell>
      <CatalogView
        key={`${initialCategory}-${initialSearch}`}
        initialCategory={initialCategory}
        initialSearch={initialSearch}
      />
    </AppShell>
  );
}
