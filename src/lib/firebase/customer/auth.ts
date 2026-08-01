import {
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { customerApp } from "./app";
import { useFirebaseEmulator } from "../use-emulator";

export const customerAuth: Auth = getAuth(customerApp);

if (useFirebaseEmulator && !globalThis.__customerAuthEmulatorConnected) {
  connectAuthEmulator(customerAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  globalThis.__customerAuthEmulatorConnected = true;
}

// Sessão vale só para a aba/navegador atual — fechar o navegador desloga.
// Evita qualquer ambiguidade de "login automático" ao reabrir o site.
setPersistence(customerAuth, browserSessionPersistence).catch(() => {
  // Persistência indisponível (ex: modo privado) — segue com o padrão em memória.
});

export const customerGoogleProvider = new GoogleAuthProvider();
// Sempre mostra o seletor de contas do Google — nunca reaproveita
// silenciosamente a última conta usada no navegador.
customerGoogleProvider.setCustomParameters({ prompt: "select_account" });

declare global {
  var __customerAuthEmulatorConnected: boolean | undefined;
}
