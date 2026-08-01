// Ativado só em desenvolvimento/testes via NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
// (ver .env.test.local e playwright.config.ts) — nunca em produção, pois a env
// var não é setada no ambiente de deploy.
export const useFirebaseEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
