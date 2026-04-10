"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { requestNotificationPermission, notifyNewMessage } from "@/lib/notifications";
import { MessageSquare, Send, Bell, Users, Sparkles, User } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Refs so subscription callback always has latest values without re-subscribing
  const userRef = useRef<any>(null);
  const notifEnabledRef = useRef(false);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select(`*, profiles:user_id (full_name, flat_number)`)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        userRef.current = authUser;
        setUser(authUser);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setProfile(profileData);
      }
    };
    init();
    fetchMessages();
    // Check notification permission once
    if (typeof Notification !== "undefined") {
      const granted = Notification.permission === "granted";
      notifEnabledRef.current = granted;
      setNotificationsEnabled(granted);
    }

    // Single subscription — appends new messages instantly without re-fetch
    const subscription = supabase
      .channel("chat_messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, async (payload) => {
        const newMsg = payload.new as any;

        // Skip if this is our own message (already shown via optimistic update)
        if (userRef.current && newMsg.user_id === userRef.current.id) return;

        // Fetch the profile for the sender
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, flat_number")
          .eq("id", newMsg.user_id)
          .single();

        const enriched = { ...newMsg, profiles: profileData };

        if (notifEnabledRef.current) {
          notifyNewMessage(profileData?.full_name || "Someone", newMsg.message);
        }

        setMessages((prev) => [...prev, enriched]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMessages]);

  const checkNotificationPermission = async () => {
    setNotificationsEnabled(Notification.permission === "granted");
  };

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    notifEnabledRef.current = granted;
    setNotificationsEnabled(granted);
  };

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const container = messagesContainerRef.current;
      const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      if (isScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const text = newMessage.trim();
    setNewMessage("");

    // Optimistic update — show immediately
    const optimistic = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      message: text,
      created_at: new Date().toISOString(),
      profiles: { full_name: profile?.full_name, flat_number: profile?.flat_number },
    };
    setMessages((prev) => [...prev, optimistic]);

    await supabase.from("chat_messages").insert({ user_id: user.id, message: text });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <MessageSquare className="w-12 h-12 text-cyan-500" />
          </motion.div>
          Community Chat
        </h1>
        <p className="text-lg text-gray-700 font-medium">Connect with your neighbors</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-lg flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Society Community</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{messages.length} messages</span>
            {!notificationsEnabled && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={enableNotifications}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm">Enable Notifications</span>
              </motion.button>
            )}
          </div>
        </div>

        <div 
          ref={messagesContainerRef}
          className="flex-1 p-6 space-y-4"
          style={{ 
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {messages.map((msg) => {
            const isOwn = msg.user_id === user?.id;
            const senderName = msg.profiles?.full_name || "Unknown User";
            const flatNumber = msg.profiles?.flat_number || "N/A";
            
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
              >
                {!isOwn && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className={`max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                  <span className="text-sm text-gray-700 mb-1 px-2 font-bold">
                    {isOwn ? "You" : `${senderName} (${flatNumber})`}
                  </span>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwn
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                {isOwn && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
