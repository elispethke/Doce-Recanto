import { products, getProductBySlug, getRelatedProducts, getProductsByIds } from "@/data/products";
import type { Product, ProductCategory } from "@/types/product";

export interface ProductQuery {
  search?: string;
  category?: ProductCategory | "todos";
  sort?: "relevancia" | "menor-preco" | "maior-preco" | "avaliacao";
}

// Camada de serviço: hoje lê os mocks locais, mas a assinatura assíncrona
// já reflete o contrato de uma futura API (ex: GET /api/products).
export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  let result = [...products];

  if (query.category && query.category !== "todos") {
    result = result.filter((product) => product.category === query.category);
  }

  if (query.search) {
    const term = query.search.trim().toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  switch (query.sort) {
    case "menor-preco":
      result.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      result.sort((a, b) => b.price - a.price);
      break;
    case "avaliacao":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return result;
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  return getProductBySlug(slug);
}

export async function fetchRelatedProducts(product: Product): Promise<Product[]> {
  return getRelatedProducts(product);
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  return getProductsByIds(ids);
}

export async function fetchHighlightedProducts(limit = 4): Promise<Product[]> {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export async function fetchBestSellers(limit = 8): Promise<Product[]> {
  return products.filter((product) => product.badge === "mais-vendido").slice(0, limit);
}

export async function fetchPromotions(limit = 8): Promise<Product[]> {
  return products.filter((product) => Boolean(product.originalPrice)).slice(0, limit);
}
