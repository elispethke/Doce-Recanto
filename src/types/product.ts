export type ProductCategory =
  | "bolos"
  | "doces"
  | "kits"
  | "personalizados"
  | "promocoes";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  ingredients: string[];
  servings?: string;
  badge?: "mais-vendido" | "promocao" | "novo";
  tags: string[];
}
