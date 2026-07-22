import type { Timestamp } from "firebase/firestore";

export interface AdminDoc {
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
}

export type OrderStatus =
  | "novo"
  | "em-producao"
  | "pronto"
  | "aguardando-motorista"
  | "em-entrega"
  | "finalizado"
  | "cancelado";

export type OrderPaymentMethod = "pix" | "cartao" | "paypal" | "dinheiro";

export interface OrderItemDoc {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDoc {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItemDoc[];
  notes?: string;
  paymentMethod: OrderPaymentMethod;
  total: number;
  status: OrderStatus;
  driverId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DriverStatus = "disponivel" | "ocupado" | "offline";

export interface DriverDoc {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  status: DriverStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CustomerDoc {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalSpent: number;
  lastPurchaseAt?: Timestamp;
  createdAt: Timestamp;
}

export interface AdminProductDoc {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ChatParticipantType = "admin" | "motorista";

export interface ChatMessageDoc {
  id: string;
  author: ChatParticipantType;
  authorId: string;
  text: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface ChatTypingDoc {
  participantId: string;
  participantType: ChatParticipantType;
  isTyping: boolean;
  updatedAt: Timestamp;
}

export interface StoreSettingsDoc {
  name: string;
  phone: string;
  hours: string;
  address?: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  paymentMethods: OrderPaymentMethod[];
  updatedAt: Timestamp;
}
