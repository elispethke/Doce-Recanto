import {
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { adminApp } from "./app";
import { useFirebaseEmulator } from "../use-emulator";

export const adminAuth: Auth = getAuth(adminApp);

if (useFirebaseEmulator && !globalThis.__adminAuthEmulatorConnected) {
  connectAuthEmulator(adminAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  globalThis.__adminAuthEmulatorConnected = true;
}

// Sessão vale só para a aba/navegador atual — fechar o navegador desloga.
setPersistence(adminAuth, browserSessionPersistence).catch(() => {
  // Persistência indisponível (ex: modo privado) — segue com o padrão em memória.
});

export const adminGoogleProvider = new GoogleAuthProvider();
// Sempre mostra o seletor de contas do Google.
adminGoogleProvider.setCustomParameters({ prompt: "select_account" });

declare global {
  var __adminAuthEmulatorConnected: boolean | undefined;
}
