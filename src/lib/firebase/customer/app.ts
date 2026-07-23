import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase/config";

// Instância de Firebase App dedicada ao site público. Fica isolada da
// instância do admin (lib/firebase/admin/app.ts) mesmo que as duas rodem no
// mesmo navegador/aba — cada uma mantém seu próprio usuário autenticado.
const APP_NAME = "customer";

export const customerApp: FirebaseApp =
  getApps().find((app) => app.name === APP_NAME) ?? initializeApp(firebaseConfig, APP_NAME);
