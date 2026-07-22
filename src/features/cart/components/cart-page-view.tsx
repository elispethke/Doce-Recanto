"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";
import { CartItem } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/store-info";
import { formatBRL } from "@/lib/format";

export function CartPageView() {
  const { items, itemCount, subtotal, deliveryFee, total } = useCart();
  const missing = Math.max(0, storeInfo.freeDeliveryThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBag className="size-9" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Seu carrinho está vazio
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explore nossos bolos e doces artesanais e adicione seus favoritos ao carrinho.
        </p>
        <Button size="lg" nativeButton={false} className="rounded-full px-8" render={<Link href="/loja" />}>
          Ver produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Meu carrinho ({itemCount})
        </h1>
        <div className="mt-4 flex flex-col divide-y divide-border rounded-2xl bg-card p-2 ring-1 ring-foreground/[0.06]">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <div key={item.productId} className="p-3">
                <CartItem item={item} />
              </div>
            ))}
          </AnimatePresence>
        </div>
        <Link href="/loja" className="mt-4 w-fit text-sm font-medium text-primary hover:underline">
          ← Continuar comprando
        </Link>
      </div>

      <div className="flex h-fit flex-col gap-5 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]">
        <h2 className="font-heading text-lg font-semibold text-foreground">Resumo do pedido</h2>
        <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        {missing > 0 && (
          <p className="rounded-xl bg-accent px-3 py-2 text-xs text-accent-foreground">
            Faltam <span className="font-semibold">{formatBRL(missing)}</span> para frete grátis
          </p>
        )}
        <Button
          size="lg"
          nativeButton={false}
          className="h-12 w-full rounded-full text-sm"
          render={<Link href="/checkout" />}
        >
          Ir para o checkout
        </Button>
      </div>
    </div>
  );
}
