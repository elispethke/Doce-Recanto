import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { adminDb } from "@/lib/firebase/admin/firestore";

// Escreve um doc na coleção "mail", observada pela extensão do Firebase
// "Trigger Email" (firestore-send-email). Precisa estar instalada e
// configurada com um provedor SMTP no Firebase Console — sem isso, o doc
// fica parado na coleção e nenhum e-mail sai. Ver README da extensão:
// https://extensions.dev/extensions/firebase/firestore-send-email
export async function sendTriggerEmail(to: string, subject: string, html: string): Promise<void> {
  await addDoc(collection(adminDb, "mail"), {
    to: [to],
    message: { subject, html },
    createdAt: serverTimestamp(),
  });
}
