import type { CartItem } from "./cart";
import type { PaymentMethod, CheckoutFormValues } from "./checkout";

export type OrderStatus =
  | "recebido"
  | "preparando"
  | "saiu-para-entrega"
  | "entregue";

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  customer: CheckoutFormValues;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface ChatMessage {
  id: string;
  author: "cliente" | "loja";
  text: string;
  time: string;
}
