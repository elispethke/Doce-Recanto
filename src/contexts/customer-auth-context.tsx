"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import type { CustomerDoc } from "@/types/firebase-models";
import type { AuthStatus } from "@/contexts/auth-context";

export interface SignUpInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface CustomerAuthContextValue {
  user: User | null;
  profile: CustomerDoc | null;
  status: AuthStatus;
  authError: string | null;
  signUp: (data: SignUpInput) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth deve ser usado dentro de um CustomerAuthProvider");
  return ctx;
}
