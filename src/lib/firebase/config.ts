import type { FirebaseOptions } from "firebase/app";

// Next.js só consegue substituir `process.env.NEXT_PUBLIC_*` no bundle do
// cliente quando o acesso é estático (dot notation literal) — por isso cada
// variável é referenciada diretamente aqui, sem indireção por helper/bracket.
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
  throw new Error(
    "Configuração do Firebase incompleta. Copie .env.example para .env.local e preencha com os valores do Console do Firebase (Configurações do projeto > Web app)."
  );
}

export const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};
