import { AppShell } from "@/components/layout/app-shell";
import { CartPageView } from "@/features/cart/components/cart-page-view";

export default function CarrinhoPage() {
  return (
    <AppShell showCartPanel={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <CartPageView />
      </div>
    </AppShell>
  );
}
