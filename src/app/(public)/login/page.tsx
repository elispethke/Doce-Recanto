import { Suspense } from "react";
import Link from "next/link";
import { CustomerLoginForm } from "@/features/customer/auth/components/customer-login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-secondary/30 p-4">
      <Suspense fallback={null}>
        <CustomerLoginForm />
      </Suspense>
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Voltar para a loja
      </Link>
    </div>
  );
}
