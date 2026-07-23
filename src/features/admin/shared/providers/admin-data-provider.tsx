"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { subscribeToAllOrders } from "@/services/firestore/orders-admin.service";
import { subscribeToDrivers } from "@/services/firestore/drivers.service";
import { subscribeToAllCustomers } from "@/services/firestore/customers-admin.service";
import { subscribeToAdminProducts } from "@/services/firestore/products-admin.service";
import { AdminDataContext } from "@/features/admin/shared/context/admin-data-context";
import type { AdminProductDoc, CustomerDoc, DriverDoc, OrderDoc } from "@/types/firebase-models";

// Um único listener em tempo real por coleção para todo o painel — montado
// aqui (no layout do grupo autenticado) em vez de em cada página, para que
// dashboard, pedidos, atribuição, financeiro, calendário e clientes
// compartilhem os mesmos dados e se atualizem juntos instantaneamente.
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<Error | null>(null);

  const [drivers, setDrivers] = useState<DriverDoc[]>([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [driversError, setDriversError] = useState<Error | null>(null);

  const [customers, setCustomers] = useState<CustomerDoc[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<Error | null>(null);

  const [products, setProducts] = useState<AdminProductDoc[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders(
      (data) => {
        setOrders(data);
        setOrdersLoading(false);
        setOrdersError(null);
      },
      (error) => {
        setOrdersError(error);
        setOrdersLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDrivers(
      (data) => {
        setDrivers(data);
        setDriversLoading(false);
        setDriversError(null);
      },
      (error) => {
        setDriversError(error);
        setDriversLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAllCustomers(
      (data) => {
        setCustomers(data);
        setCustomersLoading(false);
        setCustomersError(null);
      },
      (error) => {
        setCustomersError(error);
        setCustomersLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAdminProducts(
      (data) => {
        setProducts(data);
        setProductsLoading(false);
        setProductsError(null);
      },
      (error) => {
        setProductsError(error);
        setProductsLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      orders,
      ordersLoading,
      ordersError,
      drivers,
      driversLoading,
      driversError,
      customers,
      customersLoading,
      customersError,
      products,
      productsLoading,
      productsError,
    }),
    [
      orders,
      ordersLoading,
      ordersError,
      drivers,
      driversLoading,
      driversError,
      customers,
      customersLoading,
      customersError,
      products,
      productsLoading,
      productsError,
    ]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
