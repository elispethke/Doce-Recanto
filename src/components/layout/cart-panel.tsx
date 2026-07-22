"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";
import { CartItem } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { storeInfo } from "@/data/store-info";

const paymentBadges = ["Visa", "Mastercard", "Pix", "Apple Pay"];

export function CartPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { items, itemCount, subtotal, deliveryFee, total } = useCart();
  const missingForFreeDelivery = Math.max(0, storeInfo.freeDeliveryThreshold - subtotal);

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto scrollbar-thin px-5 py-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Meu carrinho ({itemCount})
        </h2>
        <Link
          href="/carrinho"
          onClick={onNavigate}
          className="text-xs font-medium text-primary hover:underline"
        >
          Editar
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ShoppingBag className="size-7" />
          </div>
          <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          <Button size="sm" nativeButton={false} render={<Link href="/loja" onClick={onNavigate} />}>
            Ver produtos
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} compact />
              ))}
            </AnimatePresence>
          </div>

          <div className="h-px bg-border" />
          <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />

          <Button
            size="lg"
            nativeButton={false}
            className="h-11 w-full rounded-full text-sm"
            render={<Link href="/checkout" onClick={onNavigate} />}
          >
            Finalizar pedido
          </Button>

          {missingForFreeDelivery > 0 ? (
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-accent to-secondary p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-primary">
                <Truck className="size-5" />
              </div>
              <p className="text-xs leading-snug text-foreground">
                Faltam <span className="font-semibold text-primary">{formatBRL(missingForFreeDelivery)}</span>{" "}
                para frete grátis
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-accent to-secondary p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-primary">
                <Truck className="size-5" />
              </div>
              <div className="text-xs leading-snug text-foreground">
                <p className="font-semibold">Frete grátis</p>
                <p className="text-muted-foreground">Aproveite em {storeInfo.deliveryCity}</p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Formas de pagamento</p>
            <div className="flex flex-wrap gap-1.5">
              {paymentBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-[0.65rem] font-medium text-foreground/70"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
