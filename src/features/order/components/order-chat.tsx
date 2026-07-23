"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeToChatMessages, sendChatMessage } from "@/services/firestore/chat.service";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import type { ChatMessageDoc } from "@/types/firebase-models";

function formatMessageTime(message: ChatMessageDoc): string {
  const date = message.createdAt?.toDate?.();
  if (!date) return "agora";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function OrderChat({ orderId }: { orderId: string }) {
  const { user } = useCustomerAuth();
  const [messages, setMessages] = useState<ChatMessageDoc[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeToChatMessages(orderId, setMessages);
  }, [orderId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    setText("");
    await sendChatMessage(orderId, "cliente", user.uid, trimmed);
  }

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/[0.06]">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Fale com a Doce Encanto</p>
        <p className="text-xs text-muted-foreground">Normalmente respondemos em poucos minutos</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin px-4 py-4">
        {messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-muted-foreground">
            Envie uma mensagem para a loja sobre o seu pedido.
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", message.author === "cliente" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  message.author === "cliente"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-secondary text-foreground"
                )}
              >
                {message.text}
                <span
                  className={cn(
                    "mt-1 block text-[0.65rem] opacity-70",
                    message.author === "cliente" ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {formatMessageTime(message)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Escreva uma mensagem..."
          className="h-10 flex-1 rounded-full border border-transparent bg-secondary/60 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-3 focus:ring-primary/15"
        />
        <button
          type="submit"
          aria-label="Enviar mensagem"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
