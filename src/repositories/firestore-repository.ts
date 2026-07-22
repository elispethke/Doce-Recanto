import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export { serverTimestamp } from "firebase/firestore";
export type { QueryConstraint } from "firebase/firestore";

// Fábrica genérica de acesso a uma coleção do Firestore. Centraliza toda
// leitura/escrita para que nenhum componente chame getDocs/onSnapshot direto —
// cada services/firestore/*.ts usa isto para sua coleção e expõe funções tipadas.
export function createRepository<T extends { id: string }>(collectionPath: string) {
  const colRef = collection(db, collectionPath) as CollectionReference<DocumentData>;

  function toEntity(id: string, data: DocumentData): T {
    return { id, ...data } as T;
  }

  async function getAll(...constraints: QueryConstraint[]): Promise<T[]> {
    const target = constraints.length ? query(colRef, ...constraints) : colRef;
    const snapshot = await getDocs(target);
    return snapshot.docs.map((docSnap) => toEntity(docSnap.id, docSnap.data()));
  }

  async function getById(id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(colRef, id));
    return snapshot.exists() ? toEntity(snapshot.id, snapshot.data()) : null;
  }

  async function create(data: Omit<T, "id">): Promise<string> {
    const ref = await addDoc(colRef, data as DocumentData);
    return ref.id;
  }

  async function update(id: string, data: Partial<Omit<T, "id">>): Promise<void> {
    await updateDoc(doc(colRef, id), data as DocumentData);
  }

  async function remove(id: string): Promise<void> {
    await deleteDoc(doc(colRef, id));
  }

  function subscribe(
    onChange: (items: T[]) => void,
    ...constraints: QueryConstraint[]
  ): () => void {
    const target = constraints.length ? query(colRef, ...constraints) : colRef;
    return onSnapshot(target, (snapshot) => {
      onChange(snapshot.docs.map((docSnap) => toEntity(docSnap.id, docSnap.data())));
    });
  }

  function subscribeToDoc(id: string, onChange: (item: T | null) => void): () => void {
    return onSnapshot(doc(colRef, id), (snapshot) => {
      onChange(snapshot.exists() ? toEntity(snapshot.id, snapshot.data()) : null);
    });
  }

  return { colRef, getAll, getById, create, update, remove, subscribe, subscribeToDoc };
}
