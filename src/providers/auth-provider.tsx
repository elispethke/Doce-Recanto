"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { AuthContext, type AuthStatus } from "@/contexts/auth-context";
import type { AdminDoc } from "@/types/firebase-models";

async function fetchAdminProfile(user: User): Promise<AdminDoc | null> {
  const snapshot = await getDoc(doc(db, "admins", user.uid));
  return snapshot.exists() ? (snapshot.data() as AdminDoc) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminDoc | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // Persistência indisponível (ex: modo privado) — segue com o padrão em memória.
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAdminProfile(null);
        setStatus("unauthenticated");
        return;
      }

      const profile = await fetchAdminProfile(firebaseUser);

      if (!profile) {
        setAuthError("Conta não autorizada a acessar o painel administrativo.");
        await signOut(auth);
        setUser(null);
        setAdminProfile(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(firebaseUser);
      setAdminProfile(profile);
      setStatus("authenticated");
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, adminProfile, status, authError, signInWithEmail, signInWithGoogle, signOutUser }),
    [user, adminProfile, status, authError, signInWithEmail, signInWithGoogle, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
