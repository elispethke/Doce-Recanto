"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { adminAuth, adminGoogleProvider } from "@/lib/firebase/admin/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { fetchAdmin } from "@/services/firestore/admins.service";
import { AuthContext, type AuthStatus } from "@/contexts/auth-context";
import type { AdminDoc } from "@/types/firebase-models";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminDoc | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAdminProfile(null);
        setStatus("unauthenticated");
        return;
      }

      try {
        // Único critério de autorização: existir admins/{uid}. Nada é
        // criado automaticamente — se não existir, acesso negado.
        const profile = await fetchAdmin(firebaseUser.uid);

        if (!profile) {
          setAuthError("Acesso negado. Essa conta não está autorizada a acessar o painel.");
          await signOut(adminAuth);
          setUser(null);
          setAdminProfile(null);
          setStatus("unauthenticated");
          return;
        }

        setUser(firebaseUser);
        setAdminProfile(profile);
        setStatus("authenticated");
      } catch (error) {
        console.error("[admin-auth]", error);
        setAuthError("Não foi possível validar essa conta. Tente novamente.");
        await signOut(adminAuth);
        setUser(null);
        setAdminProfile(null);
        setStatus("unauthenticated");
      }
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(adminAuth, email, password);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      await signInWithPopup(adminAuth, adminGoogleProvider);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(adminAuth);
  }, []);

  const value = useMemo(
    () => ({ user, adminProfile, status, authError, signInWithEmail, signInWithGoogle, signOutUser }),
    [user, adminProfile, status, authError, signInWithEmail, signInWithGoogle, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
