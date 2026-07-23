import type { Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { customerDb } from "@/lib/firebase/customer/firestore";
import type { AddressDoc, CustomerDoc } from "@/types/firebase-models";

// Uso atual é só do lado do cliente (perfil próprio). Quando o admin ganhar
// uma tela de CRM de clientes, criar um service equivalente usando adminDb
// em vez de reaproveitar este (evita misturar as duas autenticações aqui).
const customersRepo = createRepository<CustomerDoc>("customers", customerDb);

export function subscribeToCustomer(
  uid: string,
  onChange: (customer: CustomerDoc | null) => void
): () => void {
  return customersRepo.subscribeToDoc(uid, onChange);
}

export async function fetchCustomer(uid: string): Promise<CustomerDoc | null> {
  return customersRepo.getById(uid);
}

export async function createCustomerProfile(
  uid: string,
  data: { name: string; email: string; phone: string }
): Promise<void> {
  await customersRepo.setById(uid, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    addresses: [],
    favoriteProductIds: [],
    totalSpent: 0,
    createdAt: serverTimestamp() as unknown as Timestamp,
  });
}

export async function updateCustomerProfile(
  uid: string,
  data: Partial<Pick<CustomerDoc, "name" | "phone">>
): Promise<void> {
  await customersRepo.update(uid, data);
}

export async function toggleFavorite(
  customer: CustomerDoc,
  productId: string
): Promise<void> {
  const isFavorite = customer.favoriteProductIds.includes(productId);
  const favoriteProductIds = isFavorite
    ? customer.favoriteProductIds.filter((id) => id !== productId)
    : [...customer.favoriteProductIds, productId];
  await customersRepo.update(customer.id, { favoriteProductIds });
}

export async function saveAddress(
  customer: CustomerDoc,
  address: Omit<AddressDoc, "id">
): Promise<void> {
  const newAddress: AddressDoc = { ...address, id: crypto.randomUUID() };
  const addresses = newAddress.isDefault
    ? [...customer.addresses.map((a) => ({ ...a, isDefault: false })), newAddress]
    : [...customer.addresses, newAddress];
  await customersRepo.update(customer.id, { addresses });
}

export async function updateAddress(customer: CustomerDoc, address: AddressDoc): Promise<void> {
  const addresses = customer.addresses.map((a) =>
    a.id === address.id
      ? address
      : { ...a, isDefault: address.isDefault ? false : a.isDefault }
  );
  await customersRepo.update(customer.id, { addresses });
}

export async function removeAddress(customer: CustomerDoc, addressId: string): Promise<void> {
  const addresses = customer.addresses.filter((a) => a.id !== addressId);
  await customersRepo.update(customer.id, { addresses });
}
