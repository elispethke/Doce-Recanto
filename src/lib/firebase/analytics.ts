import { isSupported, getAnalytics, type Analytics } from "firebase/analytics";
import { customerApp } from "./customer/app";

let analyticsPromise: Promise<Analytics | null> | null = null;

// Analytics só funciona no browser e apenas quando o ambiente é suportado
// (usa IndexedDB/cookies). Lazy + memoizado para nunca rodar durante SSR.
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) =>
      supported ? getAnalytics(customerApp) : null
    );
  }

  return analyticsPromise;
}
