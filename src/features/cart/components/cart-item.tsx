"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/features/cart/context/cart-context";
import type { CartItem as CartItemType } from "@/types/cart";

export function CartItem({ item, compact = false }: { item: CartItemType; compact?: boolean }) {
  const { increment, decrement, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-3"
    >
      <div className={`relative shrink-0 overflow-hidden rounded-xl ${compact ? "size-14" : "size-20"}`}>
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium text-foreground ${compact ? "text-sm" : "text-base"}`}>
          {item.name}
        </p>
        <p className={`text-primary ${compact ? "text-xs" : "text-sm"} font-semibold`}>
          {formatBRL(item.price)}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            onClick={() => decrement(item.productId)}
            aria-label="Diminuir quantidade"
            className="flex size-6 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-4 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
          <button
            onClick={() => increment(item.productId)}
            aria-label="Aumentar quantidade"
            className="flex size-6 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent"
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.productId)}
        aria-label="Remover item"
        className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}
