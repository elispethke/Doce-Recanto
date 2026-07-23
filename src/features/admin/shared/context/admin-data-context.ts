"use client";

import { createContext, useContext } from "react";
import type { AdminProductDoc, CustomerDoc, DriverDoc, OrderDoc } from "@/types/firebase-models";

export interface AdminDataContextValue {
  orders: OrderDoc[];
  ordersLoading: boolean;
  ordersError: Error | null;
  drivers: DriverDoc[];
  driversLoading: boolean;
  driversError: Error | null;
  customers: CustomerDoc[];
  customersLoading: boolean;
  customersError: Error | null;
  products: AdminProductDoc[];
  productsLoading: boolean;
  productsError: Error | null;
}

export const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData deve ser usado dentro de um AdminDataProvider");
  return ctx;
}
