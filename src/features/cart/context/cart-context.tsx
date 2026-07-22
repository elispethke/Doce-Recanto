"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartAction, CartItem, CartState } from "@/types/cart";
import type { Product } from "@/types/product";
import { storeInfo } from "@/data/store-info";

const CART_STORAGE_KEY = "doce-encanto:cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD_ITEM": {
      const quantity = action.quantity ?? 1;
      const existing = state.items.find((item) => item.productId === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            image: action.product.images[0],
            price: action.product.price,
            quantity,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.productId !== action.productId) };
    case "INCREMENT":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", items: JSON.parse(stored) });
      }
    } catch {
      // localStorage indisponível — segue com carrinho vazio
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee =
      itemCount === 0 || subtotal >= storeInfo.freeDeliveryThreshold
        ? 0
        : storeInfo.deliveryFee;

    return {
      items: state.items,
      itemCount,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      addItem: (product, quantity) => dispatch({ type: "ADD_ITEM", product, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
      increment: (productId) => dispatch({ type: "INCREMENT", productId }),
      decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return ctx;
}
