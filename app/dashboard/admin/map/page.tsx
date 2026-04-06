"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { DynamicAdminMap } from "@/components/map/DynamicLocationPicker";
import { Map, AlertCircle, Flame } from "lucide-react";

export default function AdminMapPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "critical">("all");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const { data } = await supabase
      .from("issues")
      .select("id, title, category, priority, status, latitude, longitude, location_description")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false });

    setIssues(data || []);
    setLoading(false);
  };

  const filtered = issues.filter((i) => {
    if (filter === "open") return i.status !== "resolved";
    if (filter === "critical") return i.priority === "critical";
    return true;
  });

  const stats = {
    total: issues.length,
    critical: issues.filter((i) => i.priority === "critical").length,
    open: issues.filter((i) => i.status === "open").length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-1">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          Issue Map
        </h1>
        <p className="text-gray-500 ml-1">Geographic view of all reported issues</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Mapped Issues", value: stats.total, color: "from-indigo-500 to-purple-600", icon: Map },
          { label: "Open Issues", value: stats.open, color: "from-orange-500 to-red-500", icon: AlertCircle },
          { label: "Critical", value: stats.critical, color: "from-red-500 to-red-700", icon: Flame },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-semibold mb-1">{s.label}</p>
                <p className="text-4xl font-extrabold">{loading ? "..." : s.value}</p>
              </div>
              <s.icon className="w-10 h-10 text-white/20" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "open", "critical"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              filter === f
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All Issues" : f === "open" ? "Open Only" : "Critical Only"}
          </button>
        ))}
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      >
        {loading ? (
          <div className="h-[420px] flex items-center justify-center text-gray-400">
            Loading issues...
          </div>
        ) : (
          <DynamicAdminMap issues={filtered} />
        )}
      </motion.div>
    </div>
  );
}
