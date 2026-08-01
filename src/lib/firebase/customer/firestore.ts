import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { customerApp } from "./app";
import { useFirebaseEmulator } from "../use-emulator";

export const customerDb: Firestore = getFirestore(customerApp);

if (useFirebaseEmulator && !globalThis.__customerFirestoreEmulatorConnected) {
  connectFirestoreEmulator(customerDb, "127.0.0.1", 8080);
  globalThis.__customerFirestoreEmulatorConnected = true;
}

declare global {
  var __customerFirestoreEmulatorConnected: boolean | undefined;
}
