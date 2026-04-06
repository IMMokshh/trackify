"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Delete, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const AUTO_CLEAR_MS = 4000;
const KEYS = ["1","2","3","4","5","6","7","8","9","","0","del"];

function vibrate() {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
}

function beep(type: "success" | "error") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = type === "success" ? 880 : 220;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

type VerifyState = "idle" | "loading" | "success" | "error";

interface PassResult {
  visitor_name: string;
  flat_number: string;
  purpose: string;
  entry_time: string;
}

const PURPOSE_COLORS: Record<string, string> = {
  Guest:    "bg-indigo-100 text-indigo-700",
  Delivery: "bg-orange-100 text-orange-700",
  Service:  "bg-blue-100 text-blue-700",
  Cab:      "bg-yellow-100 text-yellow-700",
  Other:    "bg-gray-100 text-gray-700",
};

export default function GuardDashboardPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [otp, setOtp] = useState("");
  const [state, setState] = useState<VerifyState>("idle");
  const [result, setResult] = useState<PassResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [activePassCount, setActivePassCount] = useState(0);

  // Access control: only guard or admin/committee
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data: member } = await supabase
        .from("society_members")
        .select("badge")
        .eq("email", user.email)
        .single();
      const badge = member?.badge || "";
      const canAccess = ["Guard", "Chairwoman", "Chairman", "Secretary", "Committee", "Treasurer"].includes(badge);
      setAllowed(canAccess);
      if (!canAccess) router.push("/dashboard");
    };
    check();
  }, [router]);

  // Active pass counter with real-time subscription
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("visitor_passes")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      setActivePassCount(count || 0);
    };
    fetchCount();

    const channel = supabase
      .channel("active-passes")
      .on("postgres_changes", { event: "*", schema: "public", table: "visitor_passes" }, fetchCount)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const reset = useCallback(() => {    setOtp("");
    setState("idle");
    setResult(null);
    setErrorMsg("");
  }, []);

  const verify = useCallback(async (code: string) => {
    if (code.length !== 6) return;
    setState("loading");
    try {
      const res = await fetch("/api/visitors/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code, guard_pin: "1234" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        beep("success");
        vibrate();
        setResult(data.pass);
        setState("success");
        setTimeout(reset, AUTO_CLEAR_MS);
      } else {
        beep("error");
        vibrate();
        setErrorMsg(data.error || "Invalid OTP");
        setState("error");
        setShake(true);
        setTimeout(() => { setShake(false); setState("idle"); setOtp(""); setErrorMsg(""); }, 2500);
      }
    } catch {
      beep("error");
      setErrorMsg("Network error. Try again.");
      setState("error");
      setTimeout(reset, 2500);
    }
  }, [reset]);

  const press = useCallback((key: string) => {
    if (state === "loading" || state === "success") return;
    vibrate();
    if (key === "del") { setOtp((p) => p.slice(0, -1)); return; }
    if (otp.length >= 6) return;
    const next = otp + key;
    setOtp(next);
    if (next.length === 6) verify(next);
  }, [otp, state, verify]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      if (e.key === "Backspace") press("del");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [press]);

  if (allowed === null) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-950 rounded-3xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold">Guard Panel</p>
          <p className="text-gray-500 text-xs">Greenwood Heights - Gate Entry</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-bold">{activePassCount}</span>
          <span className="text-gray-400 text-xs">active passes</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">

          {/* Success */}
          {state === "success" && result && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-900">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </motion.div>
              <div>
                <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-2">Entry Approved</p>
                <h2 className="text-4xl font-black text-white mb-1">{result.visitor_name}</h2>
                <p className="text-gray-400 text-xl font-bold">Flat {result.flat_number}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${PURPOSE_COLORS[result.purpose] || PURPOSE_COLORS.Other}`}>
                {result.purpose}
              </span>
              <p className="text-gray-600 text-sm">Auto-clearing in {AUTO_CLEAR_MS / 1000}s...</p>
            </motion.div>
          )}

          {/* Error */}
          {state === "error" && (
            <motion.div key="error"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-sm text-center">
              <motion.div animate={shake ? { x: [-12, 12, -12, 12, 0] } : {}} transition={{ duration: 0.4 }}
                className="w-28 h-28 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center">
                <XCircle className="w-16 h-16 text-red-500" />
              </motion.div>
              <div>
                <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">Access Denied</p>
                <p className="text-white text-xl font-bold">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          {/* Idle / Loading */}
          {(state === "idle" || state === "loading") && (
            <motion.div key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8 w-full max-w-xs">
              <div className="text-center">
                <h2 className="text-white text-2xl font-black mb-1">Enter Visitor OTP</h2>
                <p className="text-gray-500 text-sm">Ask visitor for their 6-digit gate pass</p>
              </div>

              {/* OTP boxes */}
              <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
                className="flex gap-3">
                {[0,1,2,3,4,5].map((i) => (
                  <div key={i} className={`w-11 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                    otp[i]
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : i === otp.length
                        ? "border-indigo-400 bg-gray-900 animate-pulse"
                        : "border-gray-700 bg-gray-900"
                  }`}>
                    {otp[i] || ""}
                  </div>
                ))}
              </motion.div>

              {state === "loading" && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
              )}

              {state === "idle" && (
                <>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {KEYS.map((key, i) => (
                      key === "" ? <div key={i} /> :
                      <motion.button key={i} whileTap={{ scale: 0.85 }} onClick={() => press(key)}
                        className={`h-16 rounded-2xl text-2xl font-bold flex items-center justify-center transition-colors ${
                          key === "del"
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-800 text-white hover:bg-gray-700 active:bg-indigo-600"
                        }`}>
                        {key === "del" ? <Delete className="w-6 h-6" /> : key}
                      </motion.button>
                    ))}
                  </div>
                  {otp.length > 0 && (
                    <button onClick={reset} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
