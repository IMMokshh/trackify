"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { callAria, getAriaContext, getContextualData, detectLanguage, handleServiceIntent, AriaMessage } from "@/lib/aria";

// ── Typing dots indicator ──────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full block"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Word-by-word typewriter ────────────────────────────────────────────────────
function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const safe = (text || "").replace(/\bundefined\b/g, "").replace(/\s{2,}/g, " ").trim();
    if (!safe) { setDisplayed(""); setDone(true); onDone?.(); return; }
    setDisplayed("");
    setDone(false);
    const chars = safe.split("");
    const len = chars.length;
    let i = 0;
    const interval = setInterval(() => {
      if (i < len) {
        const ch = chars[i];
        if (ch !== undefined) {
          setDisplayed((prev) => prev + ch);
        }
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-gray-500 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

// ── Language badge ─────────────────────────────────────────────────────────────
function LangBadge({ flag, label }: { flag: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full"
    >
      <span className="text-xs">{flag}</span>
      <span className="text-[10px] text-violet-600 font-medium">{label}</span>
    </motion.div>
  );
}

// ── Quick suggestion chips ─────────────────────────────────────────────────────
const SUGGESTIONS = [
  { emoji: "💰", text: "What's my maintenance status?" },
  { emoji: "📅", text: "Show my upcoming bookings" },
  { emoji: "🔧", text: "How do I report an issue?" },
  { emoji: "🚨", text: "I need emergency help" },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function AriaAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<(AriaMessage & { id: number; isNew?: boolean })[]>([]);  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [detectedLang, setDetectedLang] = useState<{ code: string; label: string; flag: string } | null>(null);
  const [context, setContext] = useState<any>(null);
  const idRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getAriaContext().then(setContext); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const addMessage = useCallback((msg: AriaMessage, isNew = false) => {
    idRef.current += 1;
    const id = idRef.current;
    // Sanitize content before storing — never let "undefined" enter message history
    const safeContent = String(msg.content || "").replace(/\bundefined\b/g, "").replace(/\s{2,}/g, " ").trim();
    if (!safeContent) return;
    setMessages((prev) => [...prev, { ...msg, content: safeContent, id, isNew }]);
  }, []);

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping || isWriting || !context) return;

    // Detect language
    const lang = detectLanguage(text);
    setDetectedLang(lang);

    const userMsg: AriaMessage = { role: "user", content: text };
    addMessage(userMsg);
    setInput("");

    // Phase 1: thinking dots (random 600–1200ms — feels human)
    setIsTyping(true);
    const thinkTime = 600 + Math.random() * 600;
    await new Promise((r) => setTimeout(r, thinkTime));
    setIsTyping(false);

    // Phase 2: fetch response
    try {
      // Check for service intent first
      const serviceIntent = await handleServiceIntent(text);
      if (serviceIntent.detected) {
        const serviceMsg = `I found a ${serviceIntent.service} service for you.\n\nTitle: ${serviceIntent.suggestedTitle}\nDescription: ${serviceIntent.suggestedDescription}\nEstimated Cost: ${serviceIntent.estimatedCost}\n\nRedirecting you to the Services page. Navigate to /dashboard/services`;
        setIsWriting(true);
        addMessage({ role: "assistant", content: serviceMsg }, true);
        setTimeout(() => {
          router.push(serviceIntent.navigateTo);
          setIsOpen(false);
          setIsWriting(false);
        }, 2800);
        return;
      }

      const contextData = await getContextualData(context);
      const allMessages = [...messages, userMsg];
      const response = await callAria(allMessages, context, contextData);

      // Check for navigation command
      const navMatch = response.match(/Navigate to (\/dashboard\/[\w-]+)/);
      const cleanResponse = (navMatch
        ? response.replace(/Navigate to \/dashboard\/[\w-]+/, "").trim()
        : response
      ).replace(/\bundefined\b/g, "").replace(/\s{2,}/g, " ").trim();

      // Phase 3: typewriter
      setIsWriting(true);
      addMessage({ role: "assistant", content: cleanResponse || "I didn't catch that. Could you rephrase?" }, true);

      if (navMatch) {
        setTimeout(() => {
          router.push(navMatch[1]);
          setIsOpen(false);
          setIsWriting(false);
        }, Math.max(cleanResponse.split(" ").length * 38 + 800, 1500));
      }
    } catch (err) {
      console.error("Aria send error:", err);
      setIsTyping(false);
      setIsWriting(false);
      addMessage({ role: "assistant", content: "Something went wrong. Please try again." }, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const firstName = context?.fullName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (!context) return null;
  return (
    <>
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            aria-label="Open Aria assistant"
          >
            <div className="absolute inset-0 bg-white rounded-full" />
            {/* pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-400"
              animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img
              src="/aria-logo.png"
              alt="Aria"
              className="relative z-10 w-9 h-9 object-contain"
              onError={(e) => {
                // fallback if logo not placed yet
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
            <span className="hidden relative z-10 text-white font-bold text-lg">A</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
              isMinimized ? "w-80 h-[68px]" : "w-[380px] h-[620px]"
            }`}
          >
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src="/aria-logo.png"
                      alt="Aria"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  {/* online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-purple-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base leading-none">Aria</h3>
                    <AnimatePresence>
                      {detectedLang && detectedLang.code !== "en" && (
                        <LangBadge flag={detectedLang.flag} label={detectedLang.label} />
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-violet-200 text-[11px] mt-0.5">
                    {isTyping ? "typing..." : isWriting ? "responding..." : "Your Society Assistant"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized
                    ? <Maximize2 className="w-4 h-4 text-white" />
                    : <Minimize2 className="w-4 h-4 text-white" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ── Messages ── */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">

                  {/* Empty state */}
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center pt-6 pb-2"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-violet-100">
                        <img
                          src="/aria-logo.png"
                          alt="Aria"
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <p className="font-semibold text-gray-900 text-base">
                        {greeting}, {firstName}! 👋
                      </p>
                      <p className="text-gray-500 text-sm mt-1 mb-5">
                        I'm Aria. Ask me anything — in any language.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s.text}
                            onClick={() => handleSend(s.text)}
                            className="text-left p-2.5 bg-gray-50 hover:bg-violet-50 hover:border-violet-200 border border-gray-100 rounded-xl text-xs text-gray-700 transition-all leading-snug"
                          >
                            <span className="block text-base mb-1">{s.emoji}</span>
                            {s.text}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Message bubbles */}
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-0.5 overflow-hidden">
                          <img
                            src="/aria-logo.png"
                            alt="Aria"
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white text-xs font-bold">A</span>';
                            }}
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm"
                        }`}
                      >
                        {msg.role === "assistant" && msg.isNew ? (
                          <TypewriterText
                            text={msg.content}
                            onDone={() => setIsWriting(false)}
                          />
                        ) : (
                          <span className="whitespace-pre-wrap">{msg.content}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing dots */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-end gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img src="/aria-logo.png" alt="" className="w-5 h-5 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm">
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input ── */}
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      disabled={isTyping || isWriting}
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none disabled:opacity-50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping || isWriting}
                      className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
                      aria-label="Send"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                  <p className="text-center text-[10px] text-gray-300 mt-2">
                    Aria speaks 100+ languages · Powered by AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
