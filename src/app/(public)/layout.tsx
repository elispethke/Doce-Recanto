import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/context/cart-context";
import { CustomerAuthProvider } from "@/providers/customer-auth-provider";

// Providers do site público (carrinho + conta de cliente) ficam isolados
// aqui — o painel /admin não passa por este layout, então nunca inicializa
// sessão de cliente nem carrinho.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerAuthProvider>
      <CartProvider>{children}</CartProvider>
    </CustomerAuthProvider>
  );
}
