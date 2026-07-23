import type { Timestamp } from "firebase/firestore";

export interface AdminDoc {
  id: string;
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
  image: string;
  price: number;
  quantity: number;
}

export interface OrderDoc {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItemDoc[];
  subtotal: number;
  deliveryFee: number;
  notes?: string;
  paymentMethod: OrderPaymentMethod;
  total: number;
  status: OrderStatus;
  driverId?: string;
  estimatedDelivery?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DriverStatus = "disponivel" | "ocupado" | "offline" | "desligado";

export interface DriverDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  status: DriverStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AddressDoc {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  zip: string;
  isDefault?: boolean;
}

export interface CustomerDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: AddressDoc[];
  favoriteProductIds: string[];
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

export type ChatParticipantType = "admin" | "motorista" | "cliente";

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

export type FinancialEntryType = "entrada" | "saida";

export interface FinancialEntryDoc {
  id: string;
  type: FinancialEntryType;
  description: string;
  amount: number;
  category?: string;
  date: string; // ISO "yyyy-MM-dd"
  createdAt: Timestamp;
}

export type CalendarEventType = "entrega" | "encomenda" | "importante";

export interface CalendarEventDoc {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // ISO "yyyy-MM-dd"
  notes?: string;
  createdAt: Timestamp;
}
