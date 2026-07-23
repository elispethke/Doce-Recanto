import { orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { customerDb } from "@/lib/firebase/customer/firestore";
import type { ChatMessageDoc, ChatParticipantType } from "@/types/firebase-models";

// Uma subcoleção por pedido. Uso atual é só do lado do cliente. Quando o
// admin ganhar a tela de chat, criar um service equivalente com adminDb —
// não reaproveitar este (evita misturar as duas autenticações).
function chatMessagesRepo(orderId: string) {
  return createRepository<ChatMessageDoc>(`chats/${orderId}/messages`, customerDb);
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
