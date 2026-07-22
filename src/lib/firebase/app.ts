import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseConfig } from "./config";

export const firebaseApp: FirebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);
