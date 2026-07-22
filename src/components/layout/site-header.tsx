"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Truck, User, ShoppingBag, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CartPanel } from "@/components/layout/cart-panel";
import { storeInfo } from "@/data/store-info";
import { useCart } from "@/features/cart/context/cart-context";

export function SiteHeader({ showCartTrigger = true }: { showCartTrigger?: boolean }) {
  const { itemCount } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = (new FormData(e.currentTarget).get("q") as string) ?? "";
    router.push(`/loja${value ? `?busca=${encodeURIComponent(value)}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:gap-6 lg:px-8">
      <button
        onClick={() => setNavOpen(true)}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-accent lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      <Link href="/" className="font-script text-2xl text-primary lg:hidden">
        Doce Encanto
      </Link>

      <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 lg:block">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          type="text"
          placeholder="Buscar bolos, doces e mais..."
          className="h-11 w-full rounded-full border border-transparent bg-secondary/60 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-3 focus:ring-primary/15"
        />
      </form>

      <div className="hidden items-center gap-1.5 text-sm text-foreground/80 xl:flex">
        <Truck className="size-4 text-primary" />
        <span className="text-muted-foreground">Entrega</span>
        <span className="flex items-center gap-0.5 font-medium">
          {storeInfo.deliveryCity}
          <ChevronDown className="size-3.5" />
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => router.push("/loja")}
          aria-label="Buscar"
          className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-accent lg:hidden"
        >
          <Search className="size-5" />
        </button>
        <button
          aria-label="Minha conta"
          className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-accent"
        >
          <User className="size-5" />
        </button>
        {showCartTrigger && (
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrinho"
            className="relative flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-accent xl:hidden"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarNav onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full max-w-sm p-0">
          <SheetTitle className="sr-only">Meu carrinho</SheetTitle>
          <CartPanel onNavigate={() => setCartOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
