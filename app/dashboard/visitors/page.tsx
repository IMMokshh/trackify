"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { generateQRCode } from "@/lib/qrcode";
import Link from "next/link";
import {
  UserCheck, Plus, Copy, Share2, Clock, CheckCircle2,
  XCircle, AlertCircle, X, ChevronDown, ChevronUp,
  QrCode, Phone, Calendar, Tag, Shield, FileText,
} from "lucide-react";

// ---- Types ----
type PassStatus = "active" | "used" | "expired" | "cancelled" | "inside" | "exited";
type PassPurpose = "Guest" | "Delivery" | "Service" | "Cab" | "Other";

interface VisitorPass {
  id: string;
  visitor_name: string;
  visitor_phone: string | null;
  purpose: PassPurpose;
  otp: string;
  exit_otp: string | null;
  valid_from: string;
  valid_until: string;
  status: PassStatus;
  entry_time: string | null;
  exit_time: string | null;
  created_at: string;
  flat_number: string;
}

// ---- Purpose config ----
const PURPOSE_CONFIG: Record<PassPurpose, { color: string; bg: string }> = {
  Guest:    { color: "text-indigo-700",  bg: "bg-indigo-100"  },
  Delivery: { color: "text-orange-700",  bg: "bg-orange-100"  },
  Service:  { color: "text-blue-700",    bg: "bg-blue-100"    },
  Cab:      { color: "text-yellow-700",  bg: "bg-yellow-100"  },
  Other:    { color: "text-gray-700",    bg: "bg-gray-100"    },
};

const STATUS_CONFIG: Record<PassStatus, { label: string; color: string; bg: string; icon: any }> = {
  active:    { label: "Active",    color: "text-green-700",  bg: "bg-green-100",  icon: CheckCircle2 },
  inside:    { label: "Inside",    color: "text-yellow-700", bg: "bg-yellow-100", icon: CheckCircle2 },
  exited:    { label: "Exited",    color: "text-blue-700",   bg: "bg-blue-100",   icon: CheckCircle2 },
  used:      { label: "Used",      color: "text-blue-700",   bg: "bg-blue-100",   icon: CheckCircle2 },
  expired:   { label: "Expired",   color: "text-gray-500",   bg: "bg-gray-100",   icon: XCircle      },
  cancelled: { label: "Cancelled", color: "text-red-600",    bg: "bg-red-100",    icon: XCircle      },
};

// ---- Countdown hook ----
function useCountdown(validUntil: string, status: PassStatus) {
  const [remaining, setRemaining] = useState("");
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (status !== "active") { setRemaining(""); return; }

    const tick = () => {
      const diff = new Date(validUntil).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Expired"); setIsNear(true); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setIsNear(diff < 30 * 60 * 1000); // red if < 30 min
      setRemaining(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [validUntil, status]);

  return { remaining, isNear };
}

// ---- Pass Card ----
function PassCard({ pass, onCancel }: { pass: VisitorPass; onCancel: (id: string) => void }) {
  const { remaining, isNear } = useCountdown(pass.valid_until, pass.status);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const isActive = pass.status === "active";
  const isInside = pass.status === "inside";
  const statusCfg = STATUS_CONFIG[pass.status];
  const purposeCfg = PURPOSE_CONFIG[pass.purpose] || PURPOSE_CONFIG.Other;
  const StatusIcon = statusCfg.icon;

  useEffect(() => {
    if (showQr && !qrUrl) {
      generateQRCode(pass.otp).then(setQrUrl).catch(console.error);
    }
  }, [showQr, pass.otp, qrUrl]);

  const copyOTP = () => {
    navigator.clipboard.writeText(pass.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const isInside = pass.status === "inside";
    const msg = isInside
      ? `Hi! Your visit to Flat ${pass.flat_number}, Greenwood Heights has been verified ✅\n\n*You are currently inside the society.*\n\nWhen you leave, show this *Exit OTP* to the guard:\n🔐 Exit OTP: *${pass.exit_otp}*\n\nThank you!`
      : `Hi! I have pre-approved your visit to Flat ${pass.flat_number}, Greenwood Heights.\n\n🔐 *Entry OTP: ${pass.otp}*\n🔓 *Exit OTP: ${pass.exit_otp}*\n\nValid until: ${new Date(pass.valid_until).toLocaleString()}\n\n• Show *Entry OTP* to the guard when you arrive\n• Show *Exit OTP* to the guard when you leave\n\n_Exit OTP will only work after entry is verified._`;
    window.open(`https://wa.me/${pass.visitor_phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={isActive ? { y: -4, boxShadow: "0 16px 48px rgba(99,102,241,0.15)" } : {}}
      className={`rounded-3xl border-2 p-6 transition-all ${
        isActive
          ? "bg-white border-indigo-200 shadow-lg shadow-indigo-50"
          : isInside
            ? "bg-yellow-50 border-yellow-300 shadow-lg shadow-yellow-50"
            : "bg-gray-50 border-gray-200 shadow-sm"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? "bg-indigo-100" : "bg-gray-200"}`}>
            <UserCheck className={`w-6 h-6 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{pass.visitor_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${purposeCfg.bg} ${purposeCfg.color}`}>
                {pass.purpose}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color}`}>
                <StatusIcon className="w-3 h-3" /> {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {isActive && remaining && (
          <div className={`text-right ${isNear ? "text-red-500" : "text-gray-500"}`}>
            <p className="text-xs font-medium">Expires in</p>
            <p className={`text-sm font-bold font-mono ${isNear ? "text-red-500" : "text-indigo-600"}`}>{remaining}</p>
          </div>
        )}
      </div>

      {/* Entry OTP display */}
      {isActive && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Entry OTP</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black font-mono tracking-[0.3em] text-indigo-700 select-all">
              {pass.otp}
            </span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={copyOTP}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                copied ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}>
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>
        </div>
      )}

      {/* Exit OTP display — only shown after visitor has entered */}
      {isInside && pass.exit_otp && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-yellow-600 mb-2 uppercase tracking-wider">Exit OTP (visitor is inside)</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black font-mono tracking-[0.3em] text-orange-700 select-all">
              {pass.exit_otp}
            </span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={copyOTP}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                copied ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}>
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>
        </div>
      )}

      {/* Info row */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500">
        {pass.visitor_phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{pass.visitor_phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{new Date(pass.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        {pass.entry_time && (
          <div className="flex items-center gap-2 col-span-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-600 font-medium">Entered at {new Date(pass.entry_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
        {pass.exit_time && (
          <div className="flex items-center gap-2 col-span-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-600 font-medium">Exited at {new Date(pass.exit_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
      </div>

      {/* QR toggle */}
      {isActive && (
        <div className="mb-4">
          <button onClick={() => setShowQr(!showQr)}
            className="flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
            <QrCode className="w-4 h-4" />
            {showQr ? "Hide QR Code" : "Show QR Code"}
            {showQr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <AnimatePresence>
            {showQr && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3 flex justify-center">
                {qrUrl
                  ? <img src={qrUrl} alt="QR Code" className="w-36 h-36 rounded-xl border-2 border-indigo-100" />
                  : <div className="w-36 h-36 bg-gray-100 rounded-xl animate-pulse" />
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Action buttons */}
      {(isActive || isInside) && (
        <div className="flex gap-2">
          {pass.visitor_phone && isActive && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors">
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </motion.button>
          )}
          {pass.visitor_phone && isInside && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors">
              <Share2 className="w-4 h-4" /> Share Exit OTP
            </motion.button>
          )}
          {isActive && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onCancel(pass.id)}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors">
              Cancel
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ---- Invite Modal ----
interface InviteModalProps {
  onClose: () => void;
  onCreated: () => void;
  prefill?: { visitor_name?: string; visitor_phone?: string; purpose?: PassPurpose; valid_from?: string; valid_until?: string };
}

function InviteModal({ onClose, onCreated, prefill }: InviteModalProps) {
  const [form, setForm] = useState({
    visitor_name:  prefill?.visitor_name  || "",
    visitor_phone: prefill?.visitor_phone || "",
    purpose:       (prefill?.purpose as PassPurpose) || "Guest" as PassPurpose,
    valid_from:    prefill?.valid_from    || "",
    valid_until:   prefill?.valid_until   || "",
  });

  // Sync prefill into form whenever it changes (handles async prefill arrival)
  useEffect(() => {
    if (prefill) {
      setForm({
        visitor_name:  prefill.visitor_name  || "",
        visitor_phone: prefill.visitor_phone || "",
        purpose:       (prefill.purpose as PassPurpose) || "Guest",
        valid_from:    prefill.valid_from    || "",
        valid_until:   prefill.valid_until   || "",
      });
    }
  }, [prefill]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<VisitorPass | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (success) generateQRCode(success.otp).then(setQrUrl).catch(console.error);
  }, [success]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.visitor_name.trim() || form.visitor_name.trim().length < 2) e.visitor_name = "Name must be at least 2 characters";
    if (form.visitor_phone && !/^[0-9]{10}$/.test(form.visitor_phone)) e.visitor_phone = "Enter a valid 10-digit phone number";
    if (form.valid_until && form.valid_from && new Date(form.valid_until) <= new Date(form.valid_from)) e.valid_until = "Expiry must be after start time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch("/api/visitors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          visitor_name:  form.visitor_name.trim(),
          visitor_phone: form.visitor_phone || null,
          purpose:       form.purpose,
          valid_from:    form.valid_from ? new Date(form.valid_from).toISOString() : undefined,
          valid_until:   form.valid_until ? new Date(form.valid_until).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create pass");
      setSuccess(data.pass);
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyOTP = () => {
    if (!success) return;
    navigator.clipboard.writeText(success.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!success) return;
    const msg = `Hi! I have pre-approved your visit to Flat ${success.flat_number}, Greenwood Heights.\n\n🔐 *Entry OTP: ${success.otp}*\n🔓 *Exit OTP: ${success.exit_otp}*\n\nValid until: ${new Date(success.valid_until).toLocaleString()}\n\n• Show *Entry OTP* to the guard when you arrive\n• Show *Exit OTP* to the guard when you leave\n\n_Exit OTP will only work after entry is verified._`;
    window.open(`https://wa.me/${success.visitor_phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Invite Visitor</h2>
              <p className="text-indigo-200 text-sm">Generate a secure gate pass</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Success state */}
          {success ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-black text-gray-900">Pass Created!</h3>
                <p className="text-gray-500 text-sm mt-1">Share the OTP or QR with your visitor</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 text-center">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Entry OTP</p>
                <p className="text-5xl font-black font-mono tracking-[0.3em] text-indigo-700 mb-3">{success.otp}</p>
                {success.exit_otp && (
                  <div className="border-t border-indigo-100 pt-3 mt-1">
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Exit OTP</p>
                    <p className="text-5xl font-black font-mono tracking-[0.3em] text-orange-600">{success.exit_otp}</p>
                  </div>
                )}
                {qrUrl && <img src={qrUrl} alt="QR" className="w-32 h-32 mx-auto rounded-xl border-2 border-indigo-100 mt-3" />}
              </div>

              <div className="text-sm text-gray-500 text-center">
                Valid until {new Date(success.valid_until).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>

              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={copyOTP}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${copied ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`}>
                  <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy OTP"}
                </motion.button>
                {success.visitor_phone && (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={shareWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors">
                    <Share2 className="w-4 h-4" /> WhatsApp
                  </motion.button>
                )}
              </div>

              <button onClick={() => { onCreated(); onClose(); }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Done
              </button>
            </motion.div>
          ) : (
            /* Form state */
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Visitor Name *</label>
                <input value={form.visitor_name} onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.visitor_name ? "border-red-300" : "border-gray-200"}`} />
                {errors.visitor_name && <p className="text-red-500 text-xs mt-1">{errors.visitor_name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone (for WhatsApp share)</label>
                <input value={form.visitor_phone} onChange={(e) => setForm({ ...form, visitor_phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.visitor_phone ? "border-red-300" : "border-gray-200"}`} />
                {errors.visitor_phone && <p className="text-red-500 text-xs mt-1">{errors.visitor_phone}</p>}
              </div>

              {/* Purpose */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Purpose</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["Guest","Delivery","Service","Cab","Other"] as PassPurpose[]).map((p) => (
                    <button key={p} onClick={() => setForm({ ...form, purpose: p })}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.purpose === p ? `${PURPOSE_CONFIG[p].bg} ${PURPOSE_CONFIG[p].color} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Valid From</label>
                  <input type="datetime-local" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Valid Until</label>
                  <input type="datetime-local" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                    className={`w-full px-3 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.valid_until ? "border-red-300" : "border-gray-200"}`} />
                  {errors.valid_until && <p className="text-red-500 text-xs mt-1">{errors.valid_until}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-400">Leave blank for default 24-hour validity</p>

              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={submit} disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm disabled:opacity-60 shadow-lg shadow-indigo-200">
                  {loading ? "Generating..." : "Generate Pass"}
                </motion.button>
                <button onClick={onClose} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function VisitorsPage() {
  const searchParams = useSearchParams();
  const [passes, setPasses] = useState<VisitorPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [entryLogs, setEntryLogs] = useState<VisitorPass[]>([]);
  const [prefill, setPrefill] = useState<{ visitor_name?: string; visitor_phone?: string; purpose?: PassPurpose; valid_from?: string; valid_until?: string } | undefined>(undefined);

  // Auto-open modal with prefill if query params are present
  useEffect(() => {
    const name        = searchParams.get("name");
    const phone       = searchParams.get("phone");
    const purpose     = searchParams.get("purpose") as PassPurpose | null;
    const date        = searchParams.get("date");
    const time        = searchParams.get("time");
    const valid_until = searchParams.get("valid_until");

    if (name || purpose) {
      let valid_from = "";
      if (date && time) {
        valid_from = `${date}T${time}`;
      } else if (date) {
        valid_from = `${date}T09:00`;
      }
      setPrefill({
        visitor_name:  name || "",
        visitor_phone: phone || "",
        purpose:       purpose || "Guest",
        valid_from,
        valid_until:   valid_until || "",
      });
      setShowModal(true);
    }
  }, [searchParams]);

  const fetchPasses = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/visitors/my-passes", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    if (data.passes) {
      setPasses(data.passes);
      setEntryLogs(data.passes.filter((p: VisitorPass) => p.status === "used"));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPasses(); }, [fetchPasses]);

  const cancelPass = async (id: string) => {
    if (!confirm("Cancel this visitor pass?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch("/api/visitors/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id }),
    });
    fetchPasses();
  };

  const activePasses = passes.filter((p) => p.status === "active" || p.status === "inside");
  const pastPasses   = passes.filter((p) => p.status !== "active" && p.status !== "inside");

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <UserCheck className="w-6 h-6 text-white" />
            </motion.div>
            Visitor Passes
          </h1>
          <p className="text-gray-500 mt-1 ml-1">Pre-approve guests with a secure OTP gate pass</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/visitors/reports">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-bold text-sm transition-colors">
              <FileText className="w-4 h-4" /> Reports
            </motion.button>
          </Link>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow">
            <Plus className="w-4 h-4" /> Invite Visitor
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Passes", value: activePasses.length, color: "bg-indigo-500", icon: Shield },
          { label: "Total Created", value: passes.length, color: "bg-violet-500", icon: Tag },
          { label: "Used Passes", value: passes.filter(p => p.status === "used").length, color: "bg-green-500", icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} p-2.5 rounded-xl`}><s.icon className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Active passes */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
          Active Passes
          {activePasses.length > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{activePasses.length}</span>}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : activePasses.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No active passes</h3>
            <p className="text-gray-400 text-sm mb-6">Invite a visitor to generate a secure gate pass with OTP</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200">
              <Plus className="w-4 h-4" /> Create First Pass
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {activePasses.map((pass) => (
                <PassCard key={pass.id} pass={pass} onCancel={cancelPass} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Past passes accordion */}
      {pastPasses.length > 0 && (
        <div>
          <button onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold text-sm transition-colors mb-3">
            {showPast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Past Passes ({pastPasses.length})
          </button>
          <AnimatePresence>
            {showPast && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-4">
                  {pastPasses.map((pass) => (
                    <PassCard key={pass.id} pass={pass} onCancel={cancelPass} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Visitor Entry Logs */}
      {entryLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            Visitor Entry Logs
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{entryLogs.length}</span>
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Visitor Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Flat No.</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Entry Time</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{log.visitor_name}</td>
                      <td className="px-4 py-3 text-gray-600">{log.flat_number}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${PURPOSE_CONFIG[log.purpose]?.bg || "bg-gray-100"} ${PURPOSE_CONFIG[log.purpose]?.color || "text-gray-700"}`}>
                          {log.purpose}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {log.entry_time
                          ? new Date(log.entry_time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showModal && <InviteModal onClose={() => { setShowModal(false); setPrefill(undefined); }} onCreated={fetchPasses} prefill={prefill} />}
      </AnimatePresence>
    </div>
  );
}
