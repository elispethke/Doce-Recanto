import { FavoritesGrid } from "@/features/customer/account/components/favorites-grid";

export default function ContaFavoritosPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Favoritos</h1>
      <FavoritesGrid />
    </div>
  );
}
