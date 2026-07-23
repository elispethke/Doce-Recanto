import { collection, getDocs, onSnapshot, orderBy, query, writeBatch, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { customerDb } from "@/lib/firebase/customer/firestore";
import type { ChatMessageDoc, ChatParticipantType, ChatTypingDoc } from "@/types/firebase-models";

// Uma subcoleção por pedido. Uso atual é só do lado do cliente. O admin usa
// um service equivalente com adminDb (chat-admin.service.ts) — não
// reaproveitar este, evita misturar as duas autenticações.
function chatMessagesRepo(orderId: string) {
  return createRepository<ChatMessageDoc>(`chats/${orderId}/messages`, customerDb);
}

function chatTypingRepo(orderId: string) {
  return createRepository<ChatTypingDoc & { id: string }>(`chats/${orderId}/typing`, customerDb);
}

export function subscribeToChatMessages(
  orderId: string,
  onChange: (messages: ChatMessageDoc[]) => void
): () => void {
  return chatMessagesRepo(orderId).subscribe(onChange, [orderBy("createdAt", "asc")]);
}

export async function sendChatMessage(
  orderId: string,
  author: ChatParticipantType,
  authorId: string,
  text: string
): Promise<void> {
  await chatMessagesRepo(orderId).create({
    author,
    authorId,
    text,
    read: false,
    createdAt: serverTimestamp() as unknown as Timestamp,
  });
}

export async function markMessagesReadByCustomer(orderId: string): Promise<void> {
  const messagesCol = collection(customerDb, `chats/${orderId}/messages`);
  const snapshot = await getDocs(messagesCol);
  const unread = snapshot.docs.filter(
    (docSnap) => docSnap.data().author !== "cliente" && docSnap.data().read === false
  );
  if (unread.length === 0) return;

  const batch = writeBatch(customerDb);
  unread.forEach((docSnap) => batch.update(docSnap.ref, { read: true }));
  await batch.commit();
}

export function subscribeToTyping(
  orderId: string,
  onChange: (typing: ChatTypingDoc[]) => void
): () => void {
  const typingCol = collection(customerDb, `chats/${orderId}/typing`);
  return onSnapshot(query(typingCol), (snapshot) => {
    onChange(snapshot.docs.map((docSnap) => docSnap.data() as ChatTypingDoc));
  });
}

export async function setCustomerTyping(
  orderId: string,
  participantId: string,
  isTyping: boolean
): Promise<void> {
  await chatTypingRepo(orderId).setById(participantId, {
    participantId,
    participantType: "cliente" as ChatParticipantType,
    isTyping,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
}
