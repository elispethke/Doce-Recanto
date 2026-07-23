"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, Heart, Sparkles } from "lucide-react";
import { RatingStars } from "@/features/catalog/components/rating-stars";
import { QuantitySelector } from "@/features/product/components/quantity-selector";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/features/cart/context/cart-context";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { toggleFavorite } from "@/services/firestore/customers.service";
import type { Product } from "@/types/product";

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { status, profile } = useCustomerAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [favoritePending, setFavoritePending] = useState(false);

  const isFavorite = profile?.favoriteProductIds.includes(product.id) ?? false;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  async function handleToggleFavorite() {
    if (status !== "authenticated" || !profile) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setFavoritePending(true);
    try {
      await toggleFavorite(profile, product.id);
    } finally {
      setFavoritePending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {product.badge && (
        <span className="flex w-fit items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkles className="size-3.5" />
          {product.badge === "mais-vendido" && "Mais vendido"}
          {product.badge === "promocao" && "Promoção"}
          {product.badge === "novo" && "Novidade"}
        </span>
      )}

      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          {product.servings && (
            <span className="text-sm text-muted-foreground">· {product.servings}</span>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl font-semibold text-primary">
          {formatBRL(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-base text-muted-foreground line-through">
            {formatBRL(product.originalPrice)}
          </span>
        )}
      </div>

      <p className="leading-relaxed text-muted-foreground">{product.description}</p>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Ingredientes selecionados</p>
        <div className="flex flex-wrap gap-2">
          {product.ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />

        <Button size="lg" onClick={handleAdd} className="h-12 flex-1 rounded-full text-sm sm:flex-none sm:px-8">
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
              >
                <Check className="size-4" /> Adicionado
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="size-4" /> Adicionar ao carrinho
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <button
          onClick={handleToggleFavorite}
          disabled={favoritePending}
          aria-label="Favoritar"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:bg-accent"
        >
          <Heart className={isFavorite ? "size-5 fill-primary text-primary" : "size-5"} />
        </button>
      </div>
    </div>
  );
}
