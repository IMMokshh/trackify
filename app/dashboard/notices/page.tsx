"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import {
  Megaphone, Plus, X, Pin, Calendar, AlertCircle,
  Sparkles, Bell, Wrench,
} from "lucide-react";

const CATEGORIES = [
  { id: "maintenance", name: "Maintenance", color: "bg-blue-100 text-blue-700", icon: Wrench },
  { id: "events", name: "Events", color: "bg-purple-100 text-purple-700", icon: Sparkles },
  { id: "alerts", name: "Alerts", color: "bg-red-100 text-red-700", icon: AlertCircle },
  { id: "general", name: "General", color: "bg-gray-100 text-gray-700", icon: Bell },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "general",
    pinned: false,
  });

  useEffect(() => {
    checkPermissions();
    fetchNotices();
  }, []);

  const checkPermissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: member } = await supabase
      .from("society_members")
      .select("badge")
      .eq("email", user.email)
      .single();
    const badge = member?.badge || "";
    setCanCreate(["Chairwoman", "Chairman", "Secretary", "Committee", "Treasurer"].includes(badge));
  };

  const fetchNotices = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  const createNotice = async () => {
    if (!newNotice.title || !newNotice.description) {
      toast.error("Please fill all fields");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("notices").insert({
      ...newNotice,
      created_by: user.id,
    });

    toast.success("Notice posted successfully!");
    setShowCreateModal(false);
    setNewNotice({ title: "", description: "", category: "general", pinned: false });
    fetchNotices();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </motion.div>
            Notice Board
          </h1>
          <p className="text-gray-500 mt-1">Official announcements and updates</p>
        </div>
        {canCreate && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Post Notice
          </motion.button>
        )}
      </motion.div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notices yet</h3>
            <p className="text-gray-500">Check back later for announcements</p>
          </div>
        ) : (
          notices.map((notice, i) => {
            const cat = CATEGORIES.find((c) => c.id === notice.category) || CATEGORIES[3];
            const Icon = cat.icon;
            return (
              <motion.div key={notice.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${
                  notice.pinned ? "border-orange-300 bg-orange-50" : "border-gray-100"
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${
                    notice.pinned ? "from-orange-500 to-red-600" : "from-gray-400 to-gray-600"
                  } rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {notice.pinned ? <Pin className="w-6 h-6 text-white" /> : <Icon className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                      {notice.pinned && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-white flex items-center gap-1 flex-shrink-0">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 whitespace-pre-wrap">{notice.description}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-3 py-1 rounded-lg font-semibold ${cat.color} flex items-center gap-1`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cat.name}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(notice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Notice Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 relative">
                <button onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-xl font-black text-white">Post New Notice</h2>
                <p className="text-orange-100 text-sm mt-1">Share important updates with residents</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Title *</label>
                  <input type="text" value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    placeholder="e.g., Water Supply Maintenance"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
                  <textarea value={newNotice.description}
                    onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                    placeholder="Provide details..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id}
                        onClick={() => setNewNotice({ ...newNotice, category: cat.id })}
                        className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          newNotice.category === cat.id
                            ? `${cat.color} border-current`
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newNotice.pinned}
                    onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Pin className="w-4 h-4" /> Pin to top
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={createNotice}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg">
                    Post Notice
                  </motion.button>
                  <button onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
