"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SOCIETY } from "@/lib/societyConfig";
import {
  Building2, User, Mail, Lock, Phone, Home, MapPin,
  FileText, ArrowRight, ArrowLeft, Check, Sparkles
} from "lucide-react";

const STEPS = ["Society Details", "Your Account", "Done"];

function SocietyRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [society, setSociety] = useState({
    name: "",
    registration_number: "",
    established_year: "",
    address: "",
    legal_address: "",
    city: "",
    state: "",
    pincode: "",
    total_units: "",
    wings: "",
    secretary_name: "",
    secretary_phone: "",
  });

  const [account, setAccount] = useState({
    full_name: "",
    email: "",
    phone: "",
    flat_number: "",
    password: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
      });
      if (authError) throw authError;

      if (authData.user) {
        // Insert society
        const { data: societyData, error: societyError } = await supabase
          .from("societies")
          .insert({
            name: society.name,
            registration_number: society.registration_number,
            established_year: society.established_year ? parseInt(society.established_year) : null,
            address: society.address,
            legal_address: society.legal_address,
            city: society.city,
            state: society.state,
            pincode: society.pincode,
            total_units: society.total_units ? parseInt(society.total_units) : null,
            wings: society.wings,
            secretary_name: society.secretary_name || account.full_name,
            secretary_phone: society.secretary_phone || account.phone,
            plan: plan,
            created_by: authData.user.id,
          })
          .select()
          .single();

        if (societyError) console.error("Society insert error:", societyError);

        // Create admin profile
        await supabase.from("profiles").insert({
          id: authData.user.id,
          email: account.email,
          full_name: account.full_name,
          phone: account.phone,
          flat_number: account.flat_number,
          role: "admin",
          society_id: societyData?.id || null,
        });

        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Trackify" className="w-14 h-14 mx-auto mb-3 object-contain" />
            <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              Register Your Society
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </h1>
            <p className="text-blue-200 mt-1 capitalize">{plan} Plan</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? "bg-green-500 text-white" : i === step ? "bg-white text-blue-700" : "bg-white/20 text-white/50"
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i === step ? "text-white font-semibold" : "text-white/50"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-green-500" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-white rounded-xl text-sm">
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 0 - Society Details */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-white/80 text-sm mb-1 block">Society Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input value={society.name} onChange={e => setSociety({...society, name: e.target.value})}
                        placeholder="e.g. Sunshine Cooperative Housing Society"
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Registration Number</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input value={society.registration_number} onChange={e => setSociety({...society, registration_number: e.target.value})}
                        placeholder="e.g. MH/MUM/HSG/12345"
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Established Year</label>
                    <input value={society.established_year} onChange={e => setSociety({...society, established_year: e.target.value})}
                      placeholder="e.g. 2005" type="number"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-white/80 text-sm mb-1 block">Society Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                      <textarea value={society.address} onChange={e => setSociety({...society, address: e.target.value})}
                        placeholder="Plot No., Street, Area"
                        rows={2}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-white/80 text-sm mb-1 block">Legal/Registered Address</label>
                    <textarea value={society.legal_address} onChange={e => setSociety({...society, legal_address: e.target.value})}
                      placeholder="As per registration documents (if different)"
                      rows={2}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">City *</label>
                    <input value={society.city} onChange={e => setSociety({...society, city: e.target.value})}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">State *</label>
                    <input value={society.state} onChange={e => setSociety({...society, state: e.target.value})}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Pincode</label>
                    <input value={society.pincode} onChange={e => setSociety({...society, pincode: e.target.value})}
                      placeholder="e.g. 400001"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Total Units/Flats</label>
                    <input value={society.total_units} onChange={e => setSociety({...society, total_units: e.target.value})}
                      placeholder="e.g. 120" type="number"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Wings/Blocks</label>
                    <input value={society.wings} onChange={e => setSociety({...society, wings: e.target.value})}
                      placeholder="e.g. A, B, C"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Secretary Name</label>
                    <input value={society.secretary_name} onChange={e => setSociety({...society, secretary_name: e.target.value})}
                      placeholder="Full name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Secretary Phone</label>
                    <input value={society.secretary_phone} onChange={e => setSociety({...society, secretary_phone: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { if (!society.name || !society.address || !society.city || !society.state) { setError("Please fill required fields (*)"); return; } setError(""); setStep(1); }}
                  className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2">
                  Next: Your Account <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 1 - Account Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-blue-200 text-sm">You'll be the admin/secretary of this society.</p>
                {[
                  { label: "Full Name *", icon: User, key: "full_name", type: "text", placeholder: "Your full name" },
                  { label: "Email *", icon: Mail, key: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Phone", icon: Phone, key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Your Flat Number *", icon: Home, key: "flat_number", type: "text", placeholder: "e.g. A-101" },
                  { label: "Password *", icon: Lock, key: "password", type: "password", placeholder: "Min 6 characters" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-white/80 text-sm mb-1 block">{f.label}</label>
                    <div className="relative">
                      <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input type={f.type} value={(account as any)[f.key]}
                        onChange={e => setAccount({...account, [f.key]: e.target.value})}
                        placeholder={f.placeholder} minLength={f.key === "password" ? 6 : undefined}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setError(""); setStep(0); }}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    onClick={() => {
                      if (!account.full_name || !account.email || !account.flat_number || !account.password) { setError("Please fill required fields (*)"); return; }
                      handleSubmit();
                    }}
                    className="flex-1 bg-white text-blue-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full" /> : <><Check className="w-5 h-5" /> Register Society</>}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 - Done */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-white mb-2">Society Registered!</h2>
                <p className="text-blue-200 mb-2">Welcome to {SOCIETY.appName}, {account.full_name}.</p>
                <p className="text-blue-300 text-sm mb-8">Check your email to verify your account, then log in.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/auth/login")}
                  className="bg-white text-blue-700 font-bold px-10 py-3 rounded-xl flex items-center gap-2 mx-auto">
                  Go to Login <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function SocietyRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SocietyRegisterContent />
    </Suspense>
  );
}
