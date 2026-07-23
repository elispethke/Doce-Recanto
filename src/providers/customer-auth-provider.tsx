"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { customerAuth, customerGoogleProvider } from "@/lib/firebase/customer/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import {
  createCustomerProfile,
  fetchCustomer,
  subscribeToCustomer,
} from "@/services/firestore/customers.service";
import {
  CustomerAuthContext,
  type SignUpInput,
} from "@/contexts/customer-auth-context";
import type { AuthStatus } from "@/contexts/auth-context";
import type { CustomerDoc } from "@/types/firebase-models";

async function ensureCustomerProfile(user: User): Promise<void> {
  const existing = await fetchCustomer(user.uid);
  if (!existing) {
    await createCustomerProfile(user.uid, {
      name: user.displayName ?? "Cliente",
      email: user.email ?? "",
      phone: "",
    });
  }
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerDoc | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(customerAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setStatus(firebaseUser ? "authenticated" : "unauthenticated");
      if (!firebaseUser) setProfile(null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeToCustomer(user.uid, setProfile);
  }, [user]);

  const signUp = useCallback(async (data: SignUpInput) => {
    setAuthError(null);
    try {
      const credential = await createUserWithEmailAndPassword(customerAuth, data.email, data.password);
      await updateProfile(credential.user, { displayName: data.name });
      await createCustomerProfile(credential.user.uid, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const credential = await signInWithEmailAndPassword(customerAuth, email, password);
      await ensureCustomerProfile(credential.user);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const credential = await signInWithPopup(customerAuth, customerGoogleProvider);
      await ensureCustomerProfile(credential.user);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(customerAuth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      status,
      authError,
      signUp,
      signInWithEmail,
      signInWithGoogle,
      signOutUser,
    }),
    [user, profile, status, authError, signUp, signInWithEmail, signInWithGoogle, signOutUser]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}
