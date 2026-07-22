"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchChatMessages, sendChatMessage, sendAutoReply } from "@/services/orders.service";
import type { ChatMessage } from "@/types/order";

export function OrderChat({ orderId }: { orderId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatMessages(orderId).then(setMessages);
  }, [orderId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    const updated = await sendChatMessage(orderId, trimmed);
    setMessages(updated);
    setIsTyping(true);
    window.setTimeout(async () => {
      const withReply = await sendAutoReply(orderId);
      setMessages(withReply);
      setIsTyping(false);
    }, 1400);
  }

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/[0.06]">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Fale com a Doce Encanto</p>
        <p className="text-xs text-muted-foreground">Normalmente respondemos em poucos minutos</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin px-4 py-4">
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
                  {message.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
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
