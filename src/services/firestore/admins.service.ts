import { createRepository } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { AdminDoc } from "@/types/firebase-models";

const adminsRepo = createRepository<AdminDoc>("admins", adminDb);

// admins/{uid} nunca é criado pelo app — só manualmente (Firestore Console)
// ou, futuramente, por uma tela de gestão de administradores dentro do
// próprio painel. Esta função só lê; não existe create/bootstrap aqui.
export async function fetchAdmin(uid: string): Promise<AdminDoc | null> {
  return adminsRepo.getById(uid);
}
