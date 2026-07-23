import { orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { AdminProductDoc } from "@/types/firebase-models";

// Coleção "products" gerenciada só pelo admin (ver firestore.rules). Ainda
// independente do catálogo público, que hoje lê de src/data/products.ts —
// unificar as duas é um passo futuro fora do escopo deste CRUD.
const productsRepo = createRepository<AdminProductDoc>("products", adminDb);

export function subscribeToAdminProducts(
  onChange: (products: AdminProductDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return productsRepo.subscribe(onChange, [orderBy("name", "asc")], onError);
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl: string;
  description?: string;
}

export async function createAdminProduct(input: ProductInput): Promise<string> {
  return productsRepo.create({
    ...input,
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
}

export async function updateAdminProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await productsRepo.update(id, { ...input, updatedAt: serverTimestamp() as unknown as Timestamp });
}

export async function removeAdminProduct(id: string): Promise<void> {
  await productsRepo.remove(id);
}
