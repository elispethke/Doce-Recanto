"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCheck, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import {
  markMessagesReadByAdmin,
  sendAdminChatMessage,
  setAdminTyping,
  subscribeToAdminChatMessages,
  subscribeToTyping,
} from "@/services/firestore/chat-admin.service";
import type { ChatMessageDoc, ChatTypingDoc, OrderDoc } from "@/types/firebase-models";
import { formatOrderId } from "@/lib/format";

function formatMessageTime(message: ChatMessageDoc): string {
  const date = message.createdAt?.toDate?.();
  if (!date) return "agora";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function AdminOrderChat({ order }: { order: OrderDoc | null }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageDoc[]>([]);
  const [typing, setTyping] = useState<ChatTypingDoc[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!order) return;
    const unsubMessages = subscribeToAdminChatMessages(order.id, setMessages);
    const unsubTyping = subscribeToTyping(order.id, setTyping);
    return () => {
      unsubMessages();
      unsubTyping();
    };
  }, [order]);

  useEffect(() => {
    if (order && messages.length > 0) {
      markMessagesReadByAdmin(order.id).catch(() => {});
    }
  }, [order, messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleTextChange(value: string) {
    setText(value);
    if (!order || !user) return;
    setAdminTyping(order.id, user.uid, true).catch(() => {});
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setAdminTyping(order.id, user.uid, false).catch(() => {});
    }, 2000);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user || !order) return;
    setText("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setAdminTyping(order.id, user.uid, false).catch(() => {});
    await sendAdminChatMessage(order, user.uid, trimmed);
  }

  if (!order) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState icon={MessageCircle} title="Selecione uma conversa" description="Escolha um pedido na lista ao lado para ver o chat." className="border-none" />
      </div>
    );
  }

  const someoneTyping = typing.some((t) => t.participantType !== "admin" && t.isTyping);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{formatOrderId(order.id)}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin px-4 py-4">
        {messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-muted-foreground">Nenhuma mensagem ainda. Diga olá!</p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isAdmin = message.author === "admin";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", isAdmin ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    isAdmin ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary text-foreground"
                  )}
                >
                  {message.text}
                  <span
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[0.65rem] opacity-70",
                      isAdmin ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  >
                    {formatMessageTime(message)}
                    {isAdmin && (message.read ? <CheckCheck className="size-3" /> : <Check className="size-3" />)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {someoneTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
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
