import { getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

// Testes E2E rodam contra o Firebase Emulator Suite (nunca o projeto real —
// ver playwright.config.ts, que sobe os emuladores e injeta
// NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true no `next dev`). Essas env vars fazem
// o Admin SDK falar com os emuladores em vez da nuvem.
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";

const PROJECT_ID = "doce-encanto-b6ecf";

function getAdminApp(): App {
  const existing = getApps().find((app) => app.name === "e2e-admin");
  if (existing) return existing;
  return initializeApp({ projectId: PROJECT_ID }, "e2e-admin");
}

const app = getAdminApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export async function resetEmulatorData() {
  await Promise.all([
    fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT_ID}/accounts`, {
      method: "DELETE",
    }),
    fetch(
      `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
      { method: "DELETE" }
    ),
  ]);
}

export async function createAuthUser(email: string, password: string, displayName?: string) {
  return adminAuth.createUser({ email, password, displayName, emailVerified: true });
}

export async function makeAdmin(uid: string, email: string, name = "Admin de Teste") {
  await adminDb
    .collection("admins")
    .doc(uid)
    .set({ id: uid, email, name, createdAt: FieldValue.serverTimestamp() });
}
