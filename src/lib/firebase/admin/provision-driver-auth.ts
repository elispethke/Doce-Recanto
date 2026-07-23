import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

// Criar um usuário via createUserWithEmailAndPassword desloga a sessão atual
// e loga como o usuário recém-criado — inaceitável aqui, pois é o admin quem
// está cadastrando o motorista. Por isso a conta é criada numa instância de
// Firebase App temporária e descartável (nunca usa `adminAuth`), preservando
// a sessão do admin. O uid retornado vira o ID do doc em drivers/{uid} — o
// futuro app do motorista fará login com o mesmo e-mail/senha e vai ler esse
// doc, no mesmo padrão de admins/{uid} e customers/{uid}.
export async function provisionDriverAuthAccount(email: string, password: string): Promise<string> {
  const tempApp = initializeApp(firebaseConfig, `driver-provision-${Date.now()}`);
  try {
    const tempAuth = getAuth(tempApp);
    const credential = await createUserWithEmailAndPassword(tempAuth, email, password);
    return credential.user.uid;
  } finally {
    await deleteApp(tempApp);
  }
}
