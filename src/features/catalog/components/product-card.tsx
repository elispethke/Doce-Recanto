"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Plus, Check } from "lucide-react";
import { RatingStars } from "@/features/catalog/components/rating-stars";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { toggleFavorite } from "@/services/firestore/customers.service";
import type { Product } from "@/types/product";

const badgeLabel: Record<NonNullable<Product["badge"]>, string> = {
  "mais-vendido": "Mais vendido",
  promocao: "Promoção",
  novo: "Novo",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { status, profile } = useCustomerAuth();
  const [justAdded, setJustAdded] = useState(false);
  const [pending, setPending] = useState(false);

  const isFavorite = profile?.favoriteProductIds.includes(product.id) ?? false;

  function handleAdd() {
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  async function handleToggleFavorite() {
    if (status !== "authenticated" || !profile) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setPending(true);
    try {
      await toggleFavorite(profile, product.id);
    } finally {
      setPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/[0.06] transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3.4] overflow-hidden">
        <Link href={`/produto/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {product.badge && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-semibold text-primary-foreground shadow-sm">
            {badgeLabel[product.badge]}
          </span>
        )}

        <button
          onClick={handleToggleFavorite}
          disabled={pending}
          aria-label="Favoritar"
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={cn("size-4", isFavorite && "fill-primary text-primary")} />
        </button>

        <motion.button
          onClick={handleAdd}
          aria-label="Adicionar ao carrinho"
          whileTap={{ scale: 0.85 }}
          className="absolute right-2.5 bottom-2.5 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30"
        >
          {justAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
        </motion.button>
      </div>

      <Link href={`/produto/${product.slug}`} className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-1 font-heading text-sm font-semibold text-foreground">
          {product.name}
        </h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-base font-semibold text-primary">
            {formatBRL(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatBRL(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
