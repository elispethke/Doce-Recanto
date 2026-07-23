import { browserSessionPersistence, getAuth, GoogleAuthProvider, setPersistence, type Auth } from "firebase/auth";
import { adminApp } from "./app";

export const adminAuth: Auth = getAuth(adminApp);

// Sessão vale só para a aba/navegador atual — fechar o navegador desloga.
setPersistence(adminAuth, browserSessionPersistence).catch(() => {
  // Persistência indisponível (ex: modo privado) — segue com o padrão em memória.
});

export const adminGoogleProvider = new GoogleAuthProvider();
// Sempre mostra o seletor de contas do Google.
adminGoogleProvider.setCustomParameters({ prompt: "select_account" });
