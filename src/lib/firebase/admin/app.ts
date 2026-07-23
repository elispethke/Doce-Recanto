import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase/config";

// Instância de Firebase App dedicada ao painel administrativo. Isolada da
// instância do cliente (lib/firebase/customer/app.ts) — logar num painel
// nunca afeta a sessão do outro, mesmo no mesmo navegador.
const APP_NAME = "admin";

export const adminApp: FirebaseApp =
  getApps().find((app) => app.name === APP_NAME) ?? initializeApp(firebaseConfig, APP_NAME);
