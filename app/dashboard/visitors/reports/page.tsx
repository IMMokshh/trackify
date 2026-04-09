"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  FileText, Search, Calendar, Download, LogIn, LogOut,
  Clock, CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import { exportVisitorPassExcel } from "@/lib/excelExport";

type VisitorStatus = "active" | "inside" | "exited" | "used" | "expired" | "cancelled";

interface VisitorLog {
  id: string;
  visitor_name: string;
  visitor_phone: string | null;
  flat_number: string;
  purpose: string;
  status: VisitorStatus;
  entry_time: string | null;
  exit_time: string | null;
  created_at: string;
  valid_until: string;
}

const STATUS_CONFIG: Record<VisitorStatus, { label: string; color: string; bg: string; icon: any }> = {
  active:    { label: "Pending",  color: "text-blue-700",   bg: "bg-blue-100",   icon: Clock       },
  inside:    { label: "Inside",   color: "text-yellow-700", bg: "bg-yellow-100", icon: LogIn       },
  exited:    { label: "Exited",   color: "text-green-700",  bg: "bg-green-100",  icon: CheckCircle2 },
  used:      { label: "Used",     color: "text-gray-700",   bg: "bg-gray-100",   icon: CheckCircle2 },
  expired:   { label: "Expired",  color: "text-gray-500",   bg: "bg-gray-100",   icon: XCircle     },
  cancelled: { label: "Cancelled",color: "text-red-600",    bg: "bg-red-100",    icon: XCircle     },
};

const PURPOSE_COLORS: Record<string, string> = {
  Guest:    "bg-indigo-100 text-indigo-700",
  Delivery: "bg-orange-100 text-orange-700",
  Service:  "bg-blue-100 text-blue-700",
  Cab:      "bg-yellow-100 text-yellow-700",
  Other:    "bg-gray-100 text-gray-700",
};

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function VisitorReportsPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [filterStatus, setFilterStatus] = useState<VisitorStatus | "all">("all");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data: member } = await supabase
        .from("society_members").select("badge").eq("email", user.email).single();
      const badge = member?.badge || "";
      const ok = ["Guard", "Chairwoman", "Chairman", "Secretary", "Committee", "Treasurer"].includes(badge);
      setAllowed(ok);
      if (!ok) router.push("/dashboard");
    };
    check();
  }, [router]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const params = new URLSearchParams({ from: fromDate, to: toDate });
    if (search) params.set("search", search);

    const res = await fetch(`/api/visitors/reports?${params}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setLogs(data.passes || []);
    setLoading(false);
  }, [fromDate, toDate, search]);

  useEffect(() => {
    if (allowed) fetchLogs();
  }, [allowed, fetchLogs]);

  const exportCSV = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id || "").single();
    await exportVisitorPassExcel(filtered, profile?.full_name || "Admin");
  };

  const filtered = logs.filter((l) => filterStatus === "all" || l.status === filterStatus);
  const insideCount = logs.filter((l) => l.status === "inside").length;
  const todayExited = logs.filter((l) => l.status === "exited").length;
  const pendingCount = logs.filter((l) => l.status === "active").length;

  if (allowed === null) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Visitor Reports</h1>
            <p className="text-gray-500 text-sm">Full entry & exit tracking log</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-colors">
          <Download className="w-4 h-4" /> Export Excel
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Currently Inside", value: insideCount, color: "bg-yellow-500", icon: LogIn, highlight: insideCount > 0 },
          { label: "Exited Today", value: todayExited, color: "bg-green-500", icon: LogOut, highlight: false },
          { label: "Pending Entry", value: pendingCount, color: "bg-blue-500", icon: Clock, highlight: false },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 ${s.highlight ? "border-yellow-300" : "border-gray-100"}`}>
            <div className={`${s.color} p-2.5 rounded-xl`}><s.icon className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, phone or flat..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            <option value="all">All</option>
            <option value="active">Pending</option>
            <option value="inside">Inside</option>
            <option value="exited">Exited</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={fetchLogs}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors">
          Apply
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No visitor logs found</p>
            <p className="text-gray-400 text-sm">Try adjusting the date range or search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Visitor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Flat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Entry Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Exit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((log) => {
                  const sc = STATUS_CONFIG[log.status] || STATUS_CONFIG.cancelled;
                  const StatusIcon = sc.icon;
                  const isInside = log.status === "inside";
                  return (
                    <tr key={log.id} className={`transition-colors ${isInside ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{log.visitor_name}</td>
                      <td className="px-4 py-3 text-gray-500">{log.visitor_phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 font-medium">{log.flat_number}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${PURPOSE_COLORS[log.purpose] || "bg-gray-100 text-gray-700"}`}>
                          {log.purpose}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 w-fit ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" /> {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{fmt(log.entry_time)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(log.exit_time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
