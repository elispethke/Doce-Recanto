import { ProfileForm } from "@/features/customer/account/components/profile-form";

export default function ContaConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Configurações</h1>
      <ProfileForm />
    </div>
  );
}
