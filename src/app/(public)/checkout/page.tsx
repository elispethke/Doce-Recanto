import { AppShell } from "@/components/layout/app-shell";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";

export default function CheckoutPage() {
  return (
    <AppShell showCartPanel={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Checkout
        </h1>
        <CheckoutForm />
      </div>
    </AppShell>
  );
}
