"use client";

import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Shield, Bell, Sparkles, Zap, ArrowRight, X, Check,
  AlertTriangle, FileText, ChevronDown, Wrench, Banknote, Bot,
  Users, CheckCircle, HeadphonesIcon,
} from "lucide-react";
import { SOCIETY } from "@/lib/societyConfig";

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Count-up (no external lib) ───────────────────────────────────────────────
function useCountUp(target: number, duration = 1.8, inView = false) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, target, { duration, ease: [0.22, 1, 0.36, 1] as any });
    return ctrl.stop;
  }, [inView, target, duration, motionVal]);
  return rounded;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, suffix, label, color, delay }: {
  icon: React.ElementType; value: number; suffix: string; label: string; color: string; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const count = useCountUp(value, 1.8, inView);
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-default transition-shadow"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">
        <motion.span>{count}</motion.span>{suffix}
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
    </motion.div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, role, text, delay }: { name: string; role: string; text: string; delay: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -5, boxShadow: "0 24px 48px rgba(59,130,246,0.10)" }}
      className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-default transition-shadow"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed italic">"{text}"</p>
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated hero blobs ──────────────────────────────────────────────────────
function HeroBlobs() {
  return (
    <>
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[650px] h-[650px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -25, 20, 0], y: [0, 25, -15, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-3xl pointer-events-none"
      />
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-md shadow-gray-100/60"
          : "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Trackify" className="w-8 h-8 object-contain" />
          <span className="text-xl font-extrabold text-gray-900">Trackify</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {[
            { id: "features", label: "Features" },
            { id: "why", label: "Why Us" },
            { id: "how-it-works", label: "How it works" },
            { id: "pricing", label: "Pricing" },
          ].map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="relative py-1 hover:text-blue-600 transition-colors duration-200 group">
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <button className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">Login</button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(59,130,246,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [showPricing, setShowPricing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const playCoinSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3");
      audio.volume = 1.0;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePlanPayment = async (plan: any) => {
    if (plan.price === "Rs.0") { window.location.href = "/auth/society-register"; return; }
    setProcessingPlan(plan.name);
    const loaded = await loadRazorpay();
    if (!loaded) { alert("Failed to load payment."); setProcessingPlan(null); return; }
    const amountPaise = plan.name === "Basic" ? 49900 : 129900;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: amountPaise,
      currency: "INR",
      name: SOCIETY.appName,
      description: `${plan.name} Plan`,
      image: "/logo.png",
      handler: () => {
        playCoinSound();
        setProcessingPlan(null);
        setShowPricing(false);
        window.location.href = `/auth/society-register?plan=${plan.name.toLowerCase()}`;
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#3b82f6" },
      modal: { ondismiss: () => setProcessingPlan(null) },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => { alert("Payment failed."); setProcessingPlan(null); });
    rzp.open();
  };

  const features = [
    { icon: Wrench, title: "Issue Management", desc: "Report, track and resolve society complaints with AI classification", color: "from-orange-500 to-red-500" },
    { icon: Banknote, title: "Society Fund Tracking", desc: "Monitor maintenance dues, expenses and fund balance in real-time", color: "from-green-500 to-emerald-600" },
    { icon: FileText, title: "Document Generation", desc: "Generate NOCs, receipts and society documents as signed PDFs", color: "from-indigo-500 to-blue-600" },
    { icon: Bell, title: "Real-time Notifications", desc: "Instant alerts for notices, payments, visitors and emergencies", color: "from-cyan-500 to-blue-500" },
    { icon: AlertTriangle, title: "Emergency SOS", desc: "One-tap SOS with auto-SMS to emergency contacts and admin", color: "from-red-500 to-rose-600" },
    { icon: Bot, title: "AI Assistance", desc: "AI-powered issue classification, cost estimation and smart suggestions", color: "from-purple-500 to-violet-600" },
  ];

  const whyPoints = [
    { icon: Zap, title: "Easy to use", desc: "Clean dashboard designed for residents of all ages - no training needed" },
    { icon: Bell, title: "Real-time updates", desc: "Live data sync across all modules - no page refresh required" },
    { icon: Bot, title: "Smart automation", desc: "AI classifies issues, estimates costs and sends alerts automatically" },
    { icon: Shield, title: "Secure document handling", desc: "Digitally stamped PDFs with tamper-proof verification built in" },
  ];

  const steps = [
    { step: "01", title: "Register Your Society", desc: "2-step onboarding - society details then admin account. Done in under 2 minutes." },
    { step: "02", title: "Add Your Residents", desc: "Admin adds members with flat numbers, roles and parking info from the admin panel." },
    { step: "03", title: "Go Live", desc: "Residents log in, raise issues, pay dues, book amenities and chat - all in one place." },
  ];

  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Societies Onboarded", color: "from-blue-500 to-indigo-600", delay: 0 },
    { icon: CheckCircle, value: 50000, suffix: "+", label: "Issues Resolved", color: "from-green-500 to-emerald-600", delay: 0.08 },
    { icon: Zap, value: 99, suffix: "%", label: "Uptime Guaranteed", color: "from-orange-500 to-amber-500", delay: 0.16 },
    { icon: HeadphonesIcon, value: 24, suffix: "/7", label: "Support Available", color: "from-purple-500 to-violet-600", delay: 0.24 },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Society Secretary, Pune",
      text: "Trackify transformed how we manage our 200-unit complex. Issue tracking alone saved us hours every week. The AI classification is surprisingly accurate.",
      delay: 0,
    },
    {
      name: "Rajesh Mehta",
      role: "Resident, Mumbai",
      text: "Finally an app that actually works for society management. Paying maintenance, booking the clubhouse, raising complaints - all from one place. Brilliant.",
      delay: 0.1,
    },
    {
      name: "Anita Desai",
      role: "Admin, Bengaluru",
      text: "The SOS feature gave our elderly residents real peace of mind. The document generation for NOCs is a lifesaver during property transactions.",
      delay: 0.2,
    },
  ];

  const plans = [
    {
      name: "Free", price: "Rs.0", period: "forever", badge: "NANO", badgeColor: "bg-gray-600",
      highlight: false, color: "from-gray-800 to-gray-900", border: "border-gray-600",
      features: ["Unlimited residents", "Issue tracking", "Community chat", "Basic visitor log", "Community support"],
      cta: "Get Started Free", ctaStyle: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    },
    {
      name: "Basic", price: "Rs.499", period: "per month", badge: "SMALL", badgeColor: "bg-blue-600",
      highlight: true, color: "from-blue-600 to-blue-800", border: "border-blue-500",
      features: ["Unlimited residents", "All Free features", "Payments & billing", "Document storage", "Amenity bookings", "Priority support"],
      cta: "Start Basic", ctaStyle: "bg-white text-blue-700 font-bold hover:bg-blue-50",
    },
    {
      name: "Pro", price: "Rs.1,299", period: "per month", badge: "2XL", badgeColor: "bg-purple-600",
      highlight: false, color: "from-purple-700 to-indigo-800", border: "border-purple-500",
      features: ["Unlimited residents", "All Basic features", "Advanced analytics", "SOS auto-SMS", "Custom branding", "Dedicated server", "24/7 support"],
      cta: "Go Pro", ctaStyle: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:opacity-90",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden relative">
      {/* Subtle Corner Tag */}
      <div className="fixed bottom-4 right-4 z-40 opacity-30 hover:opacity-60 transition-opacity duration-300 pointer-events-none select-none">
        <img src="/cklogoshort.png" alt="CK" className="h-5 w-auto object-contain" style={{ filter: "grayscale(1)" }} />
      </div>

      {/* NAV */}
      <Navbar onGetStarted={() => setShowPricing(true)} />

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <HeroBlobs />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Smart Society Management Platform
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-blue-200 text-base font-medium mb-2 tracking-wide uppercase"
          >
            Smart Society Management Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-5xl md:text-7xl font-extrabold mb-3 leading-tight tracking-tight"
          >
            Trackify
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-xl md:text-2xl text-yellow-300 font-semibold mb-4"
          >
            Smart Society Management System
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Manage residents, services, expenses, and documents efficiently in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 16px 40px rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPricing(true)}
              className="bg-white text-blue-700 font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
            <a href="#features">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-colors"
              >
                Explore Features
              </motion.button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: "15+", label: "Features" },
              { value: "100%", label: "Secure" },
              { value: "24/7", label: "Uptime" },
              { value: "Unlimited", label: "Residents" },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.18)" }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 transition-colors"
              >
                <div className="text-2xl font-extrabold text-yellow-300">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* STATISTICS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </Section>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Everything your society needs</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">From daily maintenance to emergency response - Trackify handles it all in one clean dashboard.</motion.p>
          </Section>

          <Section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={i % 2 === 0 ? fadeLeft : fadeRight}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* WHY THIS SYSTEM */}
      <section id="why" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Trackify?</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Built for real societies</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-xl mx-auto">Four reasons why societies choose Trackify over spreadsheets and WhatsApp groups.</motion.p>
          </Section>

          <Section className="grid md:grid-cols-2 gap-6">
            {whyPoints.map((p, i) => (
              <motion.div key={p.title} variants={i % 2 === 0 ? fadeLeft : fadeRight}
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(59,130,246,0.08)" }}
                className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 transition-all group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">How it works</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Up and running in minutes</motion.h2>
          </Section>

          <Section className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <motion.div
                    whileHover={{ scale: 1.08, boxShadow: "0 16px 32px rgba(59,130,246,0.3)" }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/25 transition-shadow"
                  >
                    <span className="text-white font-extrabold text-lg">{s.step}</span>
                  </motion.div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* SOS HIGHLIGHT BAND */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto">
          <Section className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeLeft}>
              <p className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">SOS Emergency System</p>
              <h2 className="text-4xl font-extrabold mb-4">One tap. Instant help.</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Residents can trigger an SOS alert that instantly saves to the database and fires an SMS to the emergency contact - no manual steps, no delays.
              </p>
              <div className="flex flex-col gap-3">
                {["Auto-SMS via Fast2SMS API", "Live alert visible to all residents", "Admin can manage and resolve alerts", "WhatsApp fallback if SMS fails"].map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-blue-100 text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeRight} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Emergency Alert</p>
                  <p className="text-blue-200 text-sm">Just now - Active</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-auto w-3 h-3 bg-red-400 rounded-full"
                />
              </div>
              <p className="text-blue-100 text-sm mb-4">Moksh Sonar (Flat A-301) needs help!</p>
              <p className="text-blue-200 text-xs">Building A, Floor 3</p>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-blue-300">
                SMS sent to emergency contact
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Loved by societies across India</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-xl mx-auto">Real feedback from admins and residents using Trackify every day.</motion.p>
          </Section>
          <Section className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Section>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Start free. Upgrade when you need more.</motion.p>
          </Section>

          <Section className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl p-7 border-2 bg-gradient-to-br ${plan.color} ${plan.border} flex flex-col ${plan.highlight ? "ring-2 ring-blue-400 ring-offset-4" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                  <span className={`${plan.badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>{plan.badge}</span>
                </div>
                <div className="mb-5">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-300 text-sm ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-200">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  disabled={processingPlan === plan.name}
                  onClick={() => handlePlanPayment(plan)}
                  className={`w-full py-3 rounded-xl text-sm transition-all disabled:opacity-60 ${plan.ctaStyle}`}
                >
                  {processingPlan === plan.name ? "Processing..." : plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="Trackify" className="w-8 h-8 object-contain" />
                <span className="text-white font-extrabold text-lg">Trackify</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Smart Society Management System for modern residential communities.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-2">For Residential Communities</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Designed for housing societies,<br />
                apartment complexes and gated communities.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {["features", "why", "pricing"].map((id) => (
                <a key={id} href={`#${id}`} className="hover:text-white transition-colors capitalize">
                  {id === "why" ? "Why Trackify" : id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/cklogoshort.png"
                alt="ContractKillers"
                className="h-6 w-auto object-contain"
              />
              <span className="text-gray-400 font-medium tracking-wide">Built by ContractKillers</span>
            </div>
            <div className="flex items-center gap-4">
              <span>2026 Trackify. All rights reserved.</span>
              <span>Powered by {SOCIETY.appName}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PRICING MODAL */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPricing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-5xl w-full shadow-2xl border border-white/10 my-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-extrabold text-white">Choose Your Plan</h2>
                  <p className="text-gray-400 mt-1">Start free, scale as you grow</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPricing(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </motion.button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div key={plan.name} whileHover={{ y: -4 }}
                    className={`relative rounded-2xl p-6 border-2 ${plan.border} bg-gradient-to-br ${plan.color} flex flex-col ${plan.highlight ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900" : ""}`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                      <span className={`${plan.badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>{plan.badge}</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-gray-300 text-sm ml-1">/{plan.period}</span>
                    </div>
                    <ul className="space-y-2 mb-5 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-200">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      disabled={processingPlan === plan.name}
                      onClick={() => handlePlanPayment(plan)}
                      className={`w-full py-3 rounded-xl text-sm transition-all disabled:opacity-60 ${plan.ctaStyle}`}
                    >
                      {processingPlan === plan.name ? "Processing..." : plan.cta}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
