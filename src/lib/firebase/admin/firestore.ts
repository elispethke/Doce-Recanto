import { getFirestore, type Firestore } from "firebase/firestore";
import { adminApp } from "./app";

export const adminDb: Firestore = getFirestore(adminApp);
