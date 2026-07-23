import { orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import { provisionDriverAuthAccount } from "@/lib/firebase/admin/provision-driver-auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import type { DriverDoc, DriverStatus } from "@/types/firebase-models";

const driversRepo = createRepository<DriverDoc>("drivers", adminDb);

export function subscribeToDrivers(
  onChange: (drivers: DriverDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return driversRepo.subscribe(onChange, [orderBy("name", "asc")], onError);
}

export interface DriverInput {
  name: string;
  phone: string;
  photoUrl?: string;
  status: DriverStatus;
}

export interface CreateDriverInput extends DriverInput {
  email: string;
  password: string;
}

// O ID do doc é o uid da conta de autenticação recém-criada (não um ID
// aleatório do Firestore) — o futuro app do motorista faz login com esse
// e-mail/senha e busca o próprio perfil em drivers/{uid}.
export async function createDriver(input: CreateDriverInput): Promise<string> {
  const { email, password, ...driverData } = input;
  let uid: string;
  try {
    uid = await provisionDriverAuthAccount(email, password);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  await driversRepo.setById(uid, {
    ...driverData,
    email,
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
  return uid;
}

export async function updateDriver(id: string, input: Partial<DriverInput>): Promise<void> {
  await driversRepo.update(id, { ...input, updatedAt: serverTimestamp() as unknown as Timestamp });
}

export async function updateDriverStatus(id: string, status: DriverStatus): Promise<void> {
  await driversRepo.update(id, { status, updatedAt: serverTimestamp() as unknown as Timestamp });
}

export async function removeDriver(id: string): Promise<void> {
  await driversRepo.remove(id);
}
