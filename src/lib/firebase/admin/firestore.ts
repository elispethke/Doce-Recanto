import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { adminApp } from "./app";
import { useFirebaseEmulator } from "../use-emulator";

export const adminDb: Firestore = getFirestore(adminApp);

if (useFirebaseEmulator && !globalThis.__adminFirestoreEmulatorConnected) {
  connectFirestoreEmulator(adminDb, "127.0.0.1", 8080);
  globalThis.__adminFirestoreEmulatorConnected = true;
}

declare global {
  var __adminFirestoreEmulatorConnected: boolean | undefined;
}
