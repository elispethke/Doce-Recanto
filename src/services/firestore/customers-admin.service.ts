import { orderBy } from "firebase/firestore";
import { createRepository } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { CustomerDoc } from "@/types/firebase-models";

const customersRepo = createRepository<CustomerDoc>("customers", adminDb);

export function subscribeToAllCustomers(
  onChange: (customers: CustomerDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return customersRepo.subscribe(onChange, [orderBy("createdAt", "desc")], onError);
}
