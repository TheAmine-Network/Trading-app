"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Mic,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/lib/DataContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Résumé du mois en cours",
  "Demandes d'entretien urgentes",
  "Locataires actifs",
  "Revenus vs dépenses",
];

export function ChatBot() {
  const { refresh } = useAppData();
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour ! Je suis **Plex**, votre assistant immobilier IA. Je peux vous donner des infos sur vos immeubles, locataires, finances, et vous aider à enregistrer des données. Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [chargement, setChargement] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, chargement]);

  // Focus input quand ouvert
  useEffect(() => {
    if (ouvert) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [ouvert]);

  const envoyerMessage = useCallback(async (texte?: string) => {
    const contenu = texte ?? input.trim();
    if (!contenu || chargement) return;

    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: contenu,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChargement(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json() as { content?: string; error?: string };

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? data.error ?? "Désolé, une erreur est survenue.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      refresh(); // Rafraîchir les données après chaque réponse du bot

      if (!ouvert) {
        setUnread((n) => n + 1);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "❌ Erreur de connexion. Vérifiez votre connexion internet.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setChargement(false);
    }
  }, [input, messages, chargement, ouvert]);

  const gererTouche = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  const effacerConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Conversation effacée. Comment puis-je vous aider ?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-24 right-4 z-50">
        <AnimatePresence>
          {!ouvert && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setOuvert(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
              {unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                >
                  {unread}
                </motion.span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Panel du chat */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-3xl shadow-2xl"
            style={{
              width: "min(400px, calc(100vw - 32px))",
              height: "min(600px, calc(100vh - 120px))",
              background: "var(--card-solid)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: "var(--gradient-brand)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Plex AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                    <p className="text-xs text-white/80">Assistant immobilier</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={effacerConversation}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/20 hover:text-white"
                  title="Effacer la conversation"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOuvert(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    )}
                  >
                    <MarkdownSimple texte={msg.content} />
                    <p className="mt-1 text-[10px] opacity-50">
                      {msg.timestamp.toLocaleTimeString("fr-CA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Indicateur de chargement */}
              {chargement && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-row gap-2"
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <Bot className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                  </div>
                  <div
                    className="chat-bubble-ai flex items-center gap-1.5"
                    style={{ padding: "12px 16px" }}
                  >
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions rapides */}
            {messages.length <= 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => envoyerMessage(s)}
                    className="flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-transparent"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--fg-secondary)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Zone de saisie */}
            <div
              className="flex items-end gap-2 border-t px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={gererTouche}
                placeholder="Posez une question..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{
                  color: "var(--fg)",
                  maxHeight: "120px",
                  lineHeight: "1.5",
                }}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => envoyerMessage()}
                disabled={!input.trim() || chargement}
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all",
                  input.trim() && !chargement
                    ? "text-white shadow-md"
                    : "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
                )}
                style={
                  input.trim() && !chargement
                    ? { background: "var(--gradient-brand)" }
                    : undefined
                }
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Rendu Markdown simplifié ─────────────────────────────────────────────────

function MarkdownSimple({ texte }: { texte: string }) {
  const lines = texte.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Titres
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="font-bold text-sm mt-2">
              {formatInline(line.slice(3))}
            </p>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <p key={i} className="font-bold text-base mt-2">
              {formatInline(line.slice(2))}
            </p>
          );
        }

        // Liste
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <p key={i} className="flex gap-1.5">
              <span className="mt-1 flex-shrink-0 text-xs opacity-40">•</span>
              <span>{formatInline(line.slice(2))}</span>
            </p>
          );
        }

        // Ligne vide
        if (!line.trim()) return <div key={i} className="h-1" />;

        return <p key={i}>{formatInline(line)}</p>;
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  // Bold **texte**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Italic *texte*
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
