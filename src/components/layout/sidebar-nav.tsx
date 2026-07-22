"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Package, Heart, MapPin, Settings, Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/categories";
import { storeInfo } from "@/data/store-info";
import { formatBRL } from "@/lib/format";
import { categoryIcons } from "@/lib/category-icons";

const secondaryItems = [
  { label: "Meus pedidos", icon: Package },
  { label: "Favoritos", icon: Heart },
  { label: "Endereços", icon: MapPin },
  { label: "Configurações", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("categoria");

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto scrollbar-thin px-5 py-6">
      <Link href="/" onClick={onNavigate} className="flex flex-col items-center gap-0.5 px-2 text-center">
        <span className="font-script text-4xl leading-none text-primary">
          Doce Encanto <span className="align-middle text-2xl">♥</span>
        </span>
        <span className="mt-1 text-[0.65rem] font-semibold tracking-[0.25em] text-muted-foreground">
          {storeInfo.tagline.toUpperCase()}
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/" && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Home className="size-4.5" />
          Início
        </Link>
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon];
          const isActive = pathname === "/loja" && activeCategory === category.slug;
          return (
            <Link
              key={category.id}
              href={`/loja?categoria=${category.slug}`}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="size-4.5" />
              {category.name}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-border" />

        {secondaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/70"
          >
            <item.icon className="size-4.5" />
            {item.label}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <Link
          href="/loja?categoria=promocoes"
          onClick={onNavigate}
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-accent to-secondary p-3"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white/60 ring-1 ring-white">
            <Image
              src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=200&q=80"
              alt=""
              fill
              sizes="56px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">Bolo do mês</p>
            <p className="font-heading text-sm font-semibold text-primary">10% OFF</p>
            <span className="text-[0.7rem] font-medium text-accent-foreground underline underline-offset-2">
              Ver oferta
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Headset className="size-4.5" />
          </div>
          <div className="text-xs leading-snug">
            <p className="font-medium text-foreground">Precisa de ajuda?</p>
            <p className="text-primary">{storeInfo.phone}</p>
            <p className="text-muted-foreground">{storeInfo.hours}</p>
          </div>
        </div>
        <p className="px-1 text-[0.65rem] text-muted-foreground">
          Frete grátis acima de {formatBRL(storeInfo.freeDeliveryThreshold)}
        </p>
      </div>
    </div>
  );
}
