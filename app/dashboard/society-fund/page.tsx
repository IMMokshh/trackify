"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Plus, X, IndianRupee, TrendingUp, TrendingDown,
  PiggyBank, Filter, Calendar, CheckCircle, Clock,
  AlertTriangle, Trash2, ChevronDown, Mic, MicOff,
  Sparkles, Building2, CreditCard, ArrowUpCircle, ArrowDownCircle,
  Edit2,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { SOCIETY } from "@/lib/societyConfig";

const CATEGORIES = ["All", "Maintenance", "Events", "Repairs", "Utilities", "Other"];
const CAT_COLORS: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Events: "bg-pink-100 text-pink-700",
  Repairs: "bg-orange-100 text-orange-700",
  Utilities: "bg-cyan-100 text-cyan-700",
  Other: "bg-gray-100 text-gray-700",
};

// Seed transactions: mix of credits and debits for demo realism
const SEED_TRANSACTIONS = [
  { id: 1, title: "Maintenance Collection - Jan", type: "credit", category: "Maintenance", amount: 120000, date: "2026-01-01", description: "Monthly maintenance collected from 120 flats at Rs. 1000 each.", status: "Approved", addedBy: "Secretary" },
  { id: 2, title: "Lift Annual Maintenance", type: "debit", category: "Maintenance", amount: 18000, date: "2026-01-10", description: "Annual AMC contract for both lifts in Wing A and Wing B.", status: "Approved", addedBy: "Secretary" },
  { id: 3, title: "CCTV Camera Upgrade", type: "debit", category: "Repairs", amount: 12000, date: "2026-01-25", description: "Replaced 4 outdated cameras with HD night-vision units.", status: "Approved", addedBy: "Chairman" },
  { id: 4, title: "Maintenance Collection - Feb", type: "credit", category: "Maintenance", amount: 120000, date: "2026-02-01", description: "Monthly maintenance collected from 120 flats.", status: "Approved", addedBy: "Secretary" },
  { id: 5, title: "Garden Landscaping", type: "debit", category: "Maintenance", amount: 3500, date: "2026-02-05", description: "Seasonal replanting and lawn trimming for society garden.", status: "Approved", addedBy: "Secretary" },
  { id: 6, title: "Water Pump Repair", type: "debit", category: "Repairs", amount: 4200, date: "2026-02-18", description: "Replaced motor and pressure valve in underground water pump.", status: "Approved", addedBy: "Chairman" },
  { id: 7, title: "Annual General Meeting", type: "debit", category: "Events", amount: 2800, date: "2026-02-20", description: "Venue setup, refreshments and printing for AGM.", status: "Approved", addedBy: "Secretary" },
  { id: 8, title: "Maintenance Collection - Mar", type: "credit", category: "Maintenance", amount: 120000, date: "2026-03-01", description: "Monthly maintenance collected from 120 flats.", status: "Approved", addedBy: "Secretary" },
  { id: 9, title: "Electricity Bill - Common Areas", type: "debit", category: "Utilities", amount: 6800, date: "2026-03-01", description: "Monthly electricity bill for lobby, parking, and garden lights.", status: "Approved", addedBy: "Secretary" },
  { id: 10, title: "Holi Celebration Event", type: "debit", category: "Events", amount: 7500, date: "2026-03-10", description: "Colors, sweets, DJ and decoration for society Holi event.", status: "Approved", addedBy: "Chairman" },
  { id: 11, title: "Terrace Waterproofing", type: "debit", category: "Repairs", amount: 22000, date: "2026-03-15", description: "Full waterproofing treatment for terrace of Wing A.", status: "Pending", addedBy: "Secretary" },
  { id: 12, title: "Painting - Common Areas", type: "debit", category: "Maintenance", amount: 35000, date: "2026-04-01", description: "Repainting of lobby, staircase and parking area walls.", status: "Pending", addedBy: "Chairman" },
];

const DEFAULT_BUDGET = 500000;
// Use centralized config - no hardcoding
const { bankAccountName: SOCIETY_NAME, bankAccountNumber: ACCOUNT_NUMBER, bankIFSC: IFSC, address: SOCIETY_ADDRESS } = SOCIETY;

// AI parser: converts natural language to structured expense fields
function parseNaturalInput(text: string) {
  const lower = text.toLowerCase();
  // Extract amount
  const amtMatch = lower.match(/(\d[\d,]*)\s*(rupees?|rs\.?|inr)?/);
  const amount = amtMatch ? amtMatch[1].replace(/,/g, "") : "";

  // Detect category
  let category = "Other";
  if (/lift|paint|garden|clean|landscap|maintenance|maint/i.test(lower)) category = "Maintenance";
  else if (/holi|diwali|ganesh|event|celebrat|function|meeting|agm/i.test(lower)) category = "Events";
  else if (/repair|fix|replac|pump|pipe|leak|cctv|camera|broken/i.test(lower)) category = "Repairs";
  else if (/electric|water|bill|utility|internet|wifi/i.test(lower)) category = "Utilities";

  // Detect type
  const type = /collect|receiv|income|credit|donation|fund/i.test(lower) ? "credit" : "debit";

  // Build title from key nouns (strip amount words)
  const cleaned = text
    .replace(/(\d[\d,]*)\s*(rupees?|rs\.?|inr)?/gi, "")
    .replace(/\b(spent|spend|paid|pay|for|on|the|a|an|and|of|in|is|was|were|has|have)\b/gi, "")
    .trim()
    .replace(/\s+/g, " ");
  const title = cleaned.length > 3
    ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    : "Society Expense";

  return { title, amount, category, type, description: text };
}

export default function SocietyFundPage() {
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS as any[]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All"); // All / credit / debit
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(DEFAULT_BUDGET));
  const [activeTab, setActiveTab] = useState<"transactions" | "bank">("transactions");

  // AI / Voice states
  const [aiInput, setAiInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [parsed, setParsed] = useState<any>(null); // preview before save

  const [form, setForm] = useState({
    title: "", type: "debit", category: "Maintenance",
    amount: "", date: new Date().toISOString().split("T")[0],
    description: "", status: "Pending", addedBy: "Secretary",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sf_transactions");
    const savedBudget = localStorage.getItem("sf_budget");
    if (saved) setTransactions(JSON.parse(saved));
    if (savedBudget) { setBudget(Number(savedBudget)); setBudgetInput(savedBudget); }
  }, []);

  const persist = (data: any[]) => {
    setTransactions(data);
    localStorage.setItem("sf_transactions", JSON.stringify(data));
  };

  // Voice recognition
  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceError("Voice not supported. Use Chrome/Edge."); return; }
    const r = new SR();
    r.lang = "en-IN"; r.continuous = false; r.interimResults = false;
    r.onstart = () => { setIsListening(true); setVoiceError(""); };
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setAiInput(t);
      setIsListening(false);
    };
    r.onerror = (e: any) => { setIsListening(false); setVoiceError("Mic error: " + e.error); };
    r.onend = () => setIsListening(false);
    try { r.start(); } catch { setIsListening(false); }
  };

  // AI parse and preview
  const handleAIParse = () => {
    if (!aiInput.trim()) return;
    const result = parseNaturalInput(aiInput);
    setParsed(result);
    setForm(prev => ({ ...prev, ...result }));
  };

  const addTransaction = () => {
    if (!form.title.trim() || !form.amount || isNaN(Number(form.amount))) {
      toast.error("Please fill title and a valid amount.");
      return;
    }
    const updated = [
      { ...form, id: Date.now(), amount: parseFloat(form.amount) },
      ...transactions,
    ];
    persist(updated);
    toast.success(`${form.type === "credit" ? "Credit" : "Expense"} added!`);
    setShowAddModal(false);
    setParsed(null);
    setAiInput("");
    setForm({ title: "", type: "debit", category: "Maintenance", amount: "", date: new Date().toISOString().split("T")[0], description: "", status: "Pending", addedBy: "Secretary" });
  };

  const removeTransaction = (id: number) => {
    persist(transactions.filter((t) => t.id !== id));
    toast.info("Transaction removed.");
  };

  const updateStatus = (id: number, status: string) => {
    const updated = transactions.map(t => t.id === id ? { ...t, status } : t);
    persist(updated);
    toast.success(`Marked as ${status}`);
  };

  const saveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      localStorage.setItem("sf_budget", String(val));
      toast.success("Budget updated!");
    }
    setShowBudgetModal(false);
  };

  // Computed values
  const totalCredits = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const balance = totalCredits - totalDebits;
  const usedPct = Math.min((totalDebits / budget) * 100, 100);
  const isWarning = usedPct >= 80;
  const isOver = totalDebits > budget;

  // Running balance for bank statement view
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let runningBalance = 0;
  const txWithBalance = sortedTx.map(t => {
    runningBalance += t.type === "credit" ? t.amount : -t.amount;
    return { ...t, runningBalance };
  }).reverse();

  const filtered = txWithBalance.filter(t => {
    const catOk = filter === "All" || t.category === filter;
    const typeOk = typeFilter === "All" || t.type === typeFilter;
    return catOk && typeOk;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Society Fund</h1>
            <p className="text-gray-500 text-sm">Smart financial tracker with AI input</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowBudgetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-300 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm">
            <PiggyBank className="w-4 h-4" /> Set Budget
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Transaction
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Credits", value: totalCredits, icon: ArrowUpCircle, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Total Debits", value: totalDebits, icon: ArrowDownCircle, color: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-700" },
          { label: "Current Balance", value: Math.abs(balance), icon: Wallet, color: balance >= 0 ? "from-blue-500 to-blue-600" : "from-red-500 to-red-600", bg: balance >= 0 ? "bg-blue-50" : "bg-red-50", text: balance >= 0 ? "text-blue-700" : "text-red-700" },
          { label: "Annual Budget", value: budget, icon: PiggyBank, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700" },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${card.bg} rounded-2xl p-4 shadow-sm`}>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} shadow-md w-fit mb-2`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
            <p className={`text-xl font-extrabold ${card.text} flex items-center gap-0.5`}>
              <IndianRupee className="w-4 h-4" />{card.value.toLocaleString("en-IN")}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Budget Usage (Debits vs Annual Budget)</p>
          <span className={`text-sm font-bold ${isOver ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-600"}`}>
            {usedPct.toFixed(1)}% used
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${usedPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"}`} />
        </div>
        {(isWarning || isOver) && (
          <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${isOver ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {isOver ? "Budget exceeded! Review your expenses." : "Warning: Over 80% of annual budget used."}
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(["transactions", "bank"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-white shadow text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>
            {tab === "bank" ? "Bank Account View" : "Transactions"}
          </button>
        ))}
      </div>

      {activeTab === "transactions" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === cat ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {["All", "credit", "debit"].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${typeFilter === t ? (t === "credit" ? "bg-emerald-600 text-white" : t === "debit" ? "bg-red-500 text-white" : "bg-gray-700 text-white") : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {t === "All" ? "All Types" : t === "credit" ? "+ Credit" : "- Debit"}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Wallet className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No transactions found.</p>
              </div>
            ) : filtered.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 hover:shadow-md transition-all group ${tx.type === "credit" ? "border-l-emerald-400" : tx.amount > 5000 ? "border-l-orange-400" : "border-l-red-300"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"}`}>
                      {tx.type === "credit"
                        ? <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                        : <ArrowDownCircle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900">{tx.title}</h3>
                        {tx.amount > 5000 && tx.type === "debit" && (
                          <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> High
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mb-1">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${CAT_COLORS[tx.category] || "bg-gray-100 text-gray-600"}`}>{tx.category}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{tx.date}</span>
                        <span className="text-gray-400">by {tx.addedBy}</span>
                        <span className={`flex items-center gap-1 font-semibold ${tx.status === "Approved" ? "text-green-600" : "text-amber-600"}`}>
                          {tx.status === "Approved" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {tx.status}
                        </span>
                      </div>
                      {tx.description && <p className="text-xs text-gray-400 line-clamp-1">{tx.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-lg font-extrabold flex items-center gap-0.5 ${tx.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                        {tx.type === "credit" ? "+" : "-"}
                        <IndianRupee className="w-4 h-4" />{tx.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400">Bal: Rs. {tx.runningBalance.toLocaleString("en-IN")}</p>
                    </div>
                    {tx.status === "Pending" && (
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateStatus(tx.id, "Approved")}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Bank Account View */}
      {activeTab === "bank" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Bank Card */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-black text-base leading-tight">{SOCIETY_NAME}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{SOCIETY_ADDRESS}</p>
                  </div>
                </div>
                <CreditCard className="w-10 h-10 text-slate-500 flex-shrink-0" />
              </div>
              <p className="text-slate-400 text-xs mb-1 tracking-widest">ACCOUNT NUMBER</p>
              <p className="text-2xl font-mono font-bold tracking-widest mb-4">{ACCOUNT_NUMBER}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-slate-400 text-xs mb-1">IFSC CODE</p>
                  <p className="font-mono font-bold">{IFSC}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1">CURRENT BALANCE</p>
                  <p className={`text-3xl font-extrabold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    Rs. {balance.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Statement */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">Mini Statement - Last 5 Transactions</p>
            </div>
            <div className="divide-y divide-gray-50">
              {txWithBalance.slice(0, 5).map((tx, i) => (
                <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"}`}>
                      {tx.type === "credit" ? <ArrowUpCircle className="w-4 h-4 text-emerald-600" /> : <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tx.title}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.type === "credit" ? "+" : "-"}Rs. {tx.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">Bal: Rs. {tx.runningBalance.toLocaleString("en-IN")}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setParsed(null); setAiInput(""); }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 relative flex-shrink-0">
                <button onClick={() => { setShowAddModal(false); setParsed(null); setAiInput(""); }}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-xl font-black text-white">Add Transaction</h2>
                <p className="text-emerald-100 text-sm mt-1">Use AI assist or fill manually</p>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                {/* AI / Voice Assist Box */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-purple-700 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Assist - Speak or Type
                  </p>
                  <p className="text-xs text-purple-500 mb-3">
                    Say something like: "5000 rupees spent on Holi decoration" and AI will fill the form.
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                      placeholder='e.g. "18000 for lift maintenance" or "collected 120000 maintenance"'
                      className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={startVoice} disabled={isListening}
                      className={`p-2.5 rounded-xl transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                      title={isListening ? "Listening..." : "Voice Input"}>
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  {isListening && <p className="text-xs text-blue-600 font-semibold mb-2 animate-pulse">Listening... speak now</p>}
                  {voiceError && <p className="text-xs text-red-500 mb-2">{voiceError}</p>}
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleAIParse}
                    disabled={!aiInput.trim()}
                    className="w-full py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Parse with AI
                  </motion.button>
                  {parsed && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-white border border-purple-200 rounded-xl p-3 text-xs space-y-1">
                      <p className="font-bold text-purple-700 mb-1">AI Preview - edit below if needed:</p>
                      <p><span className="text-gray-500">Title:</span> {parsed.title}</p>
                      <p><span className="text-gray-500">Amount:</span> Rs. {parsed.amount}</p>
                      <p><span className="text-gray-500">Category:</span> {parsed.category}</p>
                      <p><span className="text-gray-500">Type:</span> {parsed.type}</p>
                    </motion.div>
                  )}
                </div>

                {/* Type Toggle */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Transaction Type *</label>
                  <div className="flex gap-2">
                    {["debit", "credit"].map(t => (
                      <button key={t} onClick={() => setForm({ ...form, type: t })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${form.type === t ? (t === "credit" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {t === "credit" ? "+ Credit (Income)" : "- Debit (Expense)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Lift Repair, Maintenance Collection"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
                    <div className="relative">
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm appearance-none bg-white">
                        {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Status</label>
                    <div className="relative">
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm appearance-none bg-white">
                        <option>Pending</option>
                        <option>Approved</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Amount (Rs.) *</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="0"
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Added By</label>
                  <input type="text" value={form.addedBy} onChange={(e) => setForm({ ...form, addedBy: e.target.value })}
                    placeholder="e.g. Secretary, Chairman"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description..."
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={addTransaction}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg">
                    Save Transaction
                  </motion.button>
                  <button onClick={() => { setShowAddModal(false); setParsed(null); setAiInput(""); }}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Set Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBudgetModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-gray-900">Set Annual Budget</h2>
                <button onClick={() => setShowBudgetModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="relative mb-4">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter annual budget"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-lg font-bold" />
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={saveBudget}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold">
                  Save Budget
                </motion.button>
                <button onClick={() => setShowBudgetModal(false)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
