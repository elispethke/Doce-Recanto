import { orderBy, where, type Timestamp } from "firebase/firestore";
import type { CartItem } from "@/types/cart";
import type { CheckoutFormValues, PaymentMethod } from "@/types/checkout";
import type { OrderDoc, OrderItemDoc, OrderPaymentMethod } from "@/types/firebase-models";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { customerDb } from "@/lib/firebase/customer/firestore";
import { storeInfo } from "@/data/store-info";

const ordersRepo = createRepository<OrderDoc>("orders", customerDb);

// A loja oferece PIX/crédito/débito no checkout, mas o financeiro do admin
// agrupa por "cartao" (crédito e débito somados) — só o PIX fica separado.
function toOrderPaymentMethod(method: PaymentMethod): OrderPaymentMethod {
  return method === "pix" ? "pix" : "cartao";
}

function generateOrderId(): string {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

function estimatedDeliveryLabel(): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 75);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

interface CreateOrderInput {
  customerId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: CheckoutFormValues;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderDoc> {
  const items: OrderItemDoc[] = input.items.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  const address = `${input.customer.endereco}, ${input.customer.numero}${
    input.customer.complemento ? ` - ${input.customer.complemento}` : ""
  } — ${input.customer.cidade}`;

  const id = generateOrderId();

  await ordersRepo.setById(id, {
    customerId: input.customerId,
    customerName: input.customer.nome,
    customerPhone: input.customer.telefone,
    address,
    items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    notes: input.customer.observacoes,
    paymentMethod: toOrderPaymentMethod(input.customer.formaPagamento),
    total: input.total,
    status: "novo",
    estimatedDelivery: estimatedDeliveryLabel(),
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });

  const order = await ordersRepo.getById(id);
  if (!order) throw new Error("Não foi possível criar o pedido.");
  return order;
}

export async function fetchOrder(id: string): Promise<OrderDoc | null> {
  return ordersRepo.getById(id.toUpperCase());
}

export function subscribeToOrder(
  id: string,
  onChange: (order: OrderDoc | null) => void
): () => void {
  return ordersRepo.subscribeToDoc(id.toUpperCase(), onChange);
}

export async function fetchCustomerOrders(customerId: string): Promise<OrderDoc[]> {
  return ordersRepo.getAll(where("customerId", "==", customerId), orderBy("createdAt", "desc"));
}

export function getWhatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? storeInfo.whatsappDefaultMessage);
  return `https://wa.me/${storeInfo.whatsappNumber}?text=${text}`;
}
