import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";

export { serverTimestamp } from "firebase/firestore";
export type { QueryConstraint } from "firebase/firestore";

// Fábrica genérica de acesso a uma coleção do Firestore. Centraliza toda
// leitura/escrita para que nenhum componente chame getDocs/onSnapshot direto —
// cada services/firestore/*.ts usa isto para sua coleção e expõe funções tipadas.
// `db` é sempre explícito (nunca um singleton global) porque o projeto tem
// duas instâncias de Firestore independentes — uma por app do cliente, outra
// pelo app do admin (ver lib/firebase/customer e lib/firebase/admin).
export function createRepository<T extends { id: string }>(collectionPath: string, db: Firestore) {
  const colRef = collection(db, collectionPath) as CollectionReference<DocumentData>;

  function toEntity(id: string, data: DocumentData): T {
    return { id, ...data } as T;
  }

  // addDoc/setDoc/updateDoc rejeitam campos com valor `undefined` (ex: um
  // input opcional deixado em branco) — filtra antes de escrever, em vez de
  // exigir que cada service se lembre de omitir a chave manualmente.
  function stripUndefined(data: DocumentData): DocumentData {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
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
    const ref = await addDoc(colRef, stripUndefined(data as DocumentData));
    return ref.id;
  }

  async function update(id: string, data: Partial<Omit<T, "id">>): Promise<void> {
    await updateDoc(doc(colRef, id), stripUndefined(data as DocumentData));
  }

  // Cria (ou substitui) um doc com ID explícito — usado quando o ID precisa
  // ser algo conhecido de antemão (ex: uid do Firebase Auth), diferente de
  // create() que sempre gera um ID novo via addDoc.
  async function setById(id: string, data: Omit<T, "id">): Promise<void> {
    await setDoc(doc(colRef, id), stripUndefined(data as DocumentData));
  }

  async function remove(id: string): Promise<void> {
    await deleteDoc(doc(colRef, id));
  }

  // onSnapshot precisa de um handler de erro explícito — sem ele, uma falha
  // (ex: regra de segurança negando acesso) vira uma exceção não tratada que
  // derruba a página. onError é opcional: por padrão só loga o erro.
  function subscribe(
    onChange: (items: T[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: Error) => void
  ): () => void {
    const target = constraints.length ? query(colRef, ...constraints) : colRef;
    return onSnapshot(
      target,
      (snapshot) => {
        onChange(snapshot.docs.map((docSnap) => toEntity(docSnap.id, docSnap.data())));
      },
      (error) => {
        console.error(`[firestore:${collectionPath}]`, error);
        onError?.(error);
      }
    );
  }

  function subscribeToDoc(
    id: string,
    onChange: (item: T | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    return onSnapshot(
      doc(colRef, id),
      (snapshot) => {
        onChange(snapshot.exists() ? toEntity(snapshot.id, snapshot.data()) : null);
      },
      (error) => {
        console.error(`[firestore:${collectionPath}/${id}]`, error);
        onError?.(error);
      }
    );
  }

  return { colRef, getAll, getById, create, setById, update, remove, subscribe, subscribeToDoc };
}
