import {
  collection,
  collectionGroup,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import { sendTriggerEmail } from "@/services/firestore/mail.service";
import { formatOrderId } from "@/lib/format";
import type { ChatMessageDoc, ChatParticipantType, ChatTypingDoc, CustomerDoc, OrderDoc } from "@/types/firebase-models";

// Mesma thread chats/{orderId} usada pelo cliente (chat.service.ts), agora
// lida via adminDb. Hoje é admin <-> cliente; quando o app do motorista
// existir, ele entra nessa mesma thread (ver TODO em firestore.rules).
function chatMessagesRepo(orderId: string) {
  return createRepository<ChatMessageDoc>(`chats/${orderId}/messages`, adminDb);
}

function chatTypingRepo(orderId: string) {
  return createRepository<ChatTypingDoc & { id: string }>(`chats/${orderId}/typing`, adminDb);
}

const customersRepo = createRepository<CustomerDoc>("customers", adminDb);

export function subscribeToAdminChatMessages(
  orderId: string,
  onChange: (messages: ChatMessageDoc[]) => void
): () => void {
  return chatMessagesRepo(orderId).subscribe(onChange, [orderBy("createdAt", "asc")]);
}

// Recebe o pedido (não só o id) para poder localizar o e-mail do cliente via
// customers/{customerId} e disparar a notificação — ver mail.service.ts.
// Falha ao notificar não deve derrubar o envio da mensagem em si.
export async function sendAdminChatMessage(order: OrderDoc, authorId: string, text: string): Promise<void> {
  await chatMessagesRepo(order.id).create({
    author: "admin",
    authorId,
    text,
    read: false,
    createdAt: serverTimestamp() as unknown as Timestamp,
  });

  try {
    const customer = await customersRepo.getById(order.customerId);
    if (customer?.email) {
      await sendTriggerEmail(
        customer.email,
        `Nova mensagem sobre o pedido ${formatOrderId(order.id)} — Doce Encanto`,
        `<p>Olá, ${customer.name}!</p><p>Você recebeu uma nova mensagem da Doce Encanto sobre o pedido ${formatOrderId(order.id)}:</p><blockquote>${text}</blockquote><p>Acesse o site para responder.</p>`
      );
    }
  } catch (error) {
    console.error("[chat-admin] falha ao notificar cliente por e-mail", error);
  }
}

export async function markMessagesReadByAdmin(orderId: string): Promise<void> {
  const messagesCol = collection(adminDb, `chats/${orderId}/messages`);
  const snapshot = await getDocs(messagesCol);
  const unread = snapshot.docs.filter(
    (docSnap) => docSnap.data().author !== "admin" && docSnap.data().read === false
  );
  if (unread.length === 0) return;

  const batch = writeBatch(adminDb);
  unread.forEach((docSnap) => batch.update(docSnap.ref, { read: true }));
  await batch.commit();
}

// Uma única query em grupo de coleção cobre o "não lido" de todos os pedidos
// de uma vez (em vez de abrir um listener por thread) — a regra isAdmin() em
// firestore.rules independe do orderId, então é permitida em collectionGroup.
export function subscribeToUnreadCounts(onChange: (counts: Record<string, number>) => void): () => void {
  const messagesGroup = collectionGroup(adminDb, "messages");
  return onSnapshot(query(messagesGroup, where("read", "==", false)), (snapshot) => {
    const counts: Record<string, number> = {};
    snapshot.docs.forEach((docSnap) => {
      if (docSnap.data().author === "admin") return;
      const orderId = docSnap.ref.parent.parent?.id;
      if (!orderId) return;
      counts[orderId] = (counts[orderId] ?? 0) + 1;
    });
    onChange(counts);
  });
}

export function subscribeToTyping(
  orderId: string,
  onChange: (typing: ChatTypingDoc[]) => void
): () => void {
  const typingCol = collection(adminDb, `chats/${orderId}/typing`);
  return onSnapshot(query(typingCol), (snapshot) => {
    onChange(snapshot.docs.map((docSnap) => docSnap.data() as ChatTypingDoc));
  });
}

export async function setAdminTyping(
  orderId: string,
  participantId: string,
  isTyping: boolean
): Promise<void> {
  await chatTypingRepo(orderId).setById(participantId, {
    participantId,
    participantType: "admin" as ChatParticipantType,
    isTyping,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  });
}
