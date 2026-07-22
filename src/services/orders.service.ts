import type { CartItem } from "@/types/cart";
import type { CheckoutFormValues } from "@/types/checkout";
import type { ChatMessage, Order, OrderStatus } from "@/types/order";
import { storeInfo } from "@/data/store-info";

const ORDERS_KEY = "doce-encanto:orders";
const CHAT_KEY_PREFIX = "doce-encanto:chat:";

function readOrders(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeOrders(orders: Record<string, Order>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
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
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: CheckoutFormValues;
}

// Camada de serviço: hoje persiste em localStorage, mas a assinatura assíncrona
// já reflete o contrato de uma futura API (ex: POST /api/orders).
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    paymentMethod: input.customer.formaPagamento,
    customer: input.customer,
    status: "recebido",
    estimatedDelivery: estimatedDeliveryLabel(),
  };

  const orders = readOrders();
  orders[order.id] = order;
  writeOrders(orders);
  seedChat(order.id);

  return order;
}

export async function fetchOrder(id: string): Promise<Order | undefined> {
  const orders = readOrders();
  return orders[id.toUpperCase()];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const orders = readOrders();
  const order = orders[id.toUpperCase()];
  if (!order) return;
  order.status = status;
  orders[id.toUpperCase()] = order;
  writeOrders(orders);
}

function seedChat(orderId: string) {
  if (typeof window === "undefined") return;
  const seeded: ChatMessage[] = [
    {
      id: crypto.randomUUID(),
      author: "loja",
      text: `Oi! Recebemos seu pedido ${orderId} e já estamos preparando tudo com muito carinho. 💗`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ];
  window.localStorage.setItem(`${CHAT_KEY_PREFIX}${orderId}`, JSON.stringify(seeded));
}

export async function fetchChatMessages(orderId: string): Promise<ChatMessage[]> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(`${CHAT_KEY_PREFIX}${orderId}`) ?? "[]");
  } catch {
    return [];
  }
}

export async function sendChatMessage(orderId: string, text: string): Promise<ChatMessage[]> {
  const messages = await fetchChatMessages(orderId);
  const newMessage: ChatMessage = {
    id: crypto.randomUUID(),
    author: "cliente",
    text,
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
  const updated = [...messages, newMessage];
  window.localStorage.setItem(`${CHAT_KEY_PREFIX}${orderId}`, JSON.stringify(updated));
  return updated;
}

export async function sendAutoReply(orderId: string): Promise<ChatMessage[]> {
  const messages = await fetchChatMessages(orderId);
  const reply: ChatMessage = {
    id: crypto.randomUUID(),
    author: "loja",
    text: "Recebemos sua mensagem! Em breve alguém da nossa equipe responde por aqui. 🍓",
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
  const updated = [...messages, reply];
  window.localStorage.setItem(`${CHAT_KEY_PREFIX}${orderId}`, JSON.stringify(updated));
  return updated;
}

export function getWhatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? storeInfo.whatsappDefaultMessage);
  return `https://wa.me/${storeInfo.whatsappNumber}?text=${text}`;
}
