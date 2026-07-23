import { orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { FinancialEntryDoc, FinancialEntryType } from "@/types/firebase-models";

const entriesRepo = createRepository<FinancialEntryDoc>("financialEntries", adminDb);

export function subscribeToFinancialEntries(
  onChange: (entries: FinancialEntryDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return entriesRepo.subscribe(onChange, [orderBy("date", "desc")], onError);
}

export interface FinancialEntryInput {
  type: FinancialEntryType;
  description: string;
  amount: number;
  category?: string;
  date: string;
}

export async function createFinancialEntry(input: FinancialEntryInput): Promise<string> {
  return entriesRepo.create({ ...input, createdAt: serverTimestamp() as unknown as Timestamp });
}

export async function removeFinancialEntry(id: string): Promise<void> {
  await entriesRepo.remove(id);
}
