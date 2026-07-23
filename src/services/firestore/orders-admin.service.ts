import { deleteField, orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { OrderDoc, OrderStatus } from "@/types/firebase-models";

// Painel administrativo: mesma coleção "orders" do lado do cliente, mas lida
// via adminDb (sessão própria do painel, ver lib/firebase/admin). Todo
// write de pedido feito pelo admin deve passar por este service.
const ordersRepo = createRepository<OrderDoc>("orders", adminDb);

export function subscribeToAllOrders(
  onChange: (orders: OrderDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return ordersRepo.subscribe(onChange, [orderBy("createdAt", "desc")], onError);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await ordersRepo.update(orderId, { status, updatedAt: serverTimestamp() as unknown as Timestamp });
}

// Único ponto de atribuição de motorista — usado tanto pelo drag-and-drop
// quanto pela atribuição manual, garantindo que os dois produzam o mesmo
// resultado (driverId setado + status avança para "em-entrega").
export async function assignDriverToOrder(orderId: string, driverId: string): Promise<void> {
  await ordersRepo.update(orderId, {
    driverId,
    status: "em-entrega",
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
}

export async function unassignDriverFromOrder(orderId: string): Promise<void> {
  await ordersRepo.update(orderId, {
    driverId: deleteField() as unknown as undefined,
    status: "aguardando-motorista",
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
}
