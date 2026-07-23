import { Suspense } from "react";
import Link from "next/link";
import { CustomerSignupForm } from "@/features/customer/auth/components/customer-signup-form";

export default function CadastroPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-secondary/30 p-4 py-10">
      <Suspense fallback={null}>
        <CustomerSignupForm />
      </Suspense>
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Voltar para a loja
      </Link>
    </div>
  );
}
