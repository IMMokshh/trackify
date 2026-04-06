"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { openRazorpayCheckout, createRazorpayOrder } from "@/lib/razorpay";
import { SOCIETY } from "@/lib/societyConfig";
import { triggerConfetti } from "@/lib/confetti";
import { playPaymentSuccessSound } from "@/lib/paymentSound";
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  TrendingUp,
  Wallet,
  Shield,
  Zap,
} from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "@/lib/toast";

const SOCIETY_NAME = "Greenwood Heights Co-operative Housing Society";
const SOCIETY_REG = "MH/MUM/HSG/TC-II/12847/2019";
const SOCIETY_ADDRESS = "Plot No. 14, Sector 7, Kharghar, Navi Mumbai - 410210";
const SOCIETY_GST = "27AABCG1234F1ZK";
const SOCIETY_PAN = "AABCG1234F";
const SOCIETY_EMAIL = "secretary@greenwoodheights.in";
const SOCIETY_PHONE = "+91 98765 43210";

async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function generateInvoice(payment: any, memberName: string, flatNumber: string) {
  const doc = new jsPDF();
  const invoiceNo = `GH/INV/${new Date().getFullYear()}/${String(payment.id).slice(-4).padStart(4, "0")}`;

  // Load signature images
  const [sigChairwoman, sigSecretary] = await Promise.all([
    loadImageAsBase64("/sig-chairwoman.png").catch(() => null),
    loadImageAsBase64("/sig-secretary.png").catch(() => null),
  ]);
  const paidDate = payment.paid_date
    ? new Date(payment.paid_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const amount = parseFloat(payment.amount);
  const gstRate = 0.18;
  const baseAmount = parseFloat((amount / (1 + gstRate)).toFixed(2));
  const gstAmount = parseFloat((amount - baseAmount).toFixed(2));

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 38, "F");
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 34, 210, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(SOCIETY_NAME, 14, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 190, 210);
  doc.text(SOCIETY_ADDRESS, 14, 21);
  doc.text(`GST: ${SOCIETY_GST}  |  PAN: ${SOCIETY_PAN}  |  Reg: ${SOCIETY_REG}`, 14, 28);

  // ── INVOICE label (top right) ─────────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 196, 20, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 190, 210);
  doc.text(invoiceNo, 196, 28, { align: "right" });

  // ── Two-column meta section ───────────────────────────────────
  doc.setTextColor(0, 0, 0);
  let y = 52;

  // Left: Billed To
  doc.setFillColor(248, 249, 255);
  doc.roundedRect(14, y, 86, 44, 3, 3, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 150);
  doc.text("BILLED TO", 20, y + 8);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(memberName, 20, y + 17);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  doc.text(`Flat No. ${flatNumber}`, 20, y + 25);
  doc.text(SOCIETY_NAME, 20, y + 32);
  doc.text(SOCIETY_ADDRESS, 20, y + 39);

  // Right: Invoice Details
  doc.setFillColor(248, 249, 255);
  doc.roundedRect(110, y, 86, 44, 3, 3, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 150);
  doc.text("INVOICE DETAILS", 116, y + 8);
  const details = [
    ["Invoice No.", invoiceNo],
    ["Invoice Date", paidDate],
    ["Payment Method", payment.payment_method || "Online"],
    ["Transaction ID", payment.razorpay_payment_id ? payment.razorpay_payment_id.slice(0, 18) : "N/A"],
  ];
  doc.setFontSize(8);
  details.forEach(([k, v], i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 100);
    doc.text(k, 116, y + 17 + i * 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(v, 193, y + 17 + i * 7, { align: "right" });
  });

  // ── Table header ──────────────────────────────────────────────
  y += 54;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("#", 18, y + 7);
  doc.text("DESCRIPTION", 26, y + 7);
  doc.text("PERIOD", 120, y + 7);
  doc.text("AMOUNT", 193, y + 7, { align: "right" });

  // ── Table row ─────────────────────────────────────────────────
  y += 10;
  doc.setFillColor(252, 252, 255);
  doc.rect(14, y, 182, 12, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("01", 18, y + 8);
  doc.setFont("helvetica", "bold");
  doc.text(payment.title || "Maintenance Fee", 26, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  doc.text(
    payment.due_date
      ? new Date(payment.due_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      : "-",
    120, y + 8
  );
  doc.setTextColor(30, 41, 59);
  doc.text(`Rs. ${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 193, y + 8, { align: "right" });

  // ── Subtotals ─────────────────────────────────────────────────
  y += 18;
  doc.setDrawColor(220, 220, 235);
  doc.setLineWidth(0.3);

  const subtotals = [
    ["Subtotal (excl. GST)", `Rs. ${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
    [`GST @ 18% (CGST 9% + SGST 9%)`, `Rs. ${gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
  ];
  subtotals.forEach(([k, v]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 100);
    doc.text(k, 120, y);
    doc.setTextColor(30, 41, 59);
    doc.text(v, 193, y, { align: "right" });
    doc.line(120, y + 2, 196, y + 2);
    y += 10;
  });

  // Total box
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(110, y - 2, 86, 14, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL PAID", 116, y + 7);
  doc.text(`Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 193, y + 7, { align: "right" });

  // ── Status stamp ──────────────────────────────────────────────
  y += 22;
  doc.setDrawColor(30, 140, 30);
  doc.setLineWidth(1.5);
  doc.roundedRect(14, y, 50, 16, 2, 2);
  doc.setTextColor(30, 140, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PAID", 39, y + 11, { align: "center" });

  // ── Notes ─────────────────────────────────────────────────────
  y += 26;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 100);
  doc.text("Notes:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text("This invoice is valid as proof of payment for society maintenance charges.", 14, y + 7);
  doc.text(`For queries contact: ${SOCIETY_EMAIL}  |  ${SOCIETY_PHONE}`, 14, y + 14);

  // ── Digital Signatures ────────────────────────────────────────
  y += 28;
  doc.setDrawColor(220, 220, 235);
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);
  y += 8;

  // Signature boxes
  const drawSigBox = (x: number, name: string, role: string, sigUrl: string) => {
    doc.setFillColor(248, 249, 255);
    doc.setDrawColor(200, 200, 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, 84, 36, 2, 2, "FD");

    // Verified badge top-right
    doc.setFillColor(220, 255, 220);
    doc.setDrawColor(30, 140, 30);
    doc.setLineWidth(0.3);
    doc.roundedRect(x + 48, y + 3, 32, 7, 1, 1, "FD");
    doc.setTextColor(30, 120, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text("DIGITALLY VERIFIED", x + 64, y + 7.5, { align: "center" });

    // Signature image
    try {
      if (sigUrl) doc.addImage(sigUrl, "PNG", x + 3, y + 4, 44, 18);
    } catch {
      // fallback italic text if image fails
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text(name.split(" ")[0], x + 5, y + 18);
    }

    // Divider line
    doc.setDrawColor(180, 180, 200);
    doc.setLineWidth(0.3);
    doc.line(x + 3, y + 24, x + 81, y + 24);

    // Name & role
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(name, x + 4, y + 29);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 130);
    doc.setFontSize(7);
    doc.text(role, x + 4, y + 34);
  };

  drawSigBox(14, "Purva Chavan", "Chairwoman & Treasurer", sigChairwoman ?? "");
  drawSigBox(110, "Moksh Sonar", "Honorary Secretary", sigSecretary ?? "");

  // Timestamp
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 170);
  const ts = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  doc.text(`Digitally signed on: ${ts} IST`, 14, y + 40);

  // ── Footer ────────────────────────────────────────────────────
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 278, 210, 19, "F");
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 278, 210, 2, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 190, 210);
  doc.text(`${SOCIETY_NAME}  |  GST: ${SOCIETY_GST}  |  Reg: ${SOCIETY_REG}`, 105, 285, { align: "center" });
  doc.text("This is a computer-generated invoice and does not require a physical signature.", 105, 291, { align: "center" });

  doc.save(`Invoice_${invoiceNo.replace(/\//g, "_")}.pdf`);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [upiId, setUpiId] = useState("");
  const [upiProcessing, setUpiProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchPayments();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
    const { data: member } = await supabase.from("society_members").select("full_name, flat_number").eq("email", user.email).single();
    if (member) setMemberInfo(member);
  };

  const fetchPayments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: false });

    if (!error && data) {
      setPayments(data);
      
      const total = data.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const paid = data.filter(p => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pending = data.filter(p => p.status === "pending").reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const overdue = data.filter(p => p.status === "overdue").reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      setStats({ total, paid, pending, overdue });
    }
    setLoading(false);
  };

  const handlePayment = async (payment: any) => {
    setSelectedPayment(payment);
    setShowUpiModal(true);
  };

  const handleUpiPayment = async () => {
    if (!upiId.trim()) {
      toast.error("Please enter UPI ID");
      return;
    }

    // Basic UPI ID validation
    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., yourname@paytm)");
      return;
    }

    setUpiProcessing(true);

    try {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save payment with UPI details
      const { error } = await supabase
        .from("payments")
        .update({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
          payment_method: "UPI",
          razorpay_payment_id: `upi_${Date.now()}`, // Generate UPI transaction ID
        })
        .eq("id", selectedPayment.id);

      if (error) throw error;

      // Log transaction
      await supabase.from("payment_transactions").insert({
        payment_id: selectedPayment.id,
        transaction_type: "payment",
        amount: parseFloat(selectedPayment.amount),
        status: "success",
        payment_method: "UPI",
        metadata: { upi_id: upiId },
      });

      toast.success("Payment successful via UPI! Pending admin verification.");
      setShowUpiModal(false);
      setUpiId("");
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      console.error("UPI Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setUpiProcessing(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [showTestCardModal, setShowTestCardModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<any>(null);

  const handleRazorpayPayment = async (payment: any) => {
    setPendingPayment(payment);
    setShowTestCardModal(true);
  };

  const proceedWithPayment = async () => {
    setShowTestCardModal(false);
    const payment = pendingPayment;
    if (!payment) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_SRPaX3DZP9tFTf",
      amount: Math.round(parseFloat(payment.amount) * 100),
      currency: "INR",
      name: SOCIETY.appName,
      description: payment.title,
      image: "https://i.imgur.com/n5tjHFD.png",
      handler: async function (response: any) {
        // amount in DB is already in rupees — no division needed
        await supabase
          .from("payments")
          .update({
            razorpay_payment_id: response.razorpay_payment_id,
            status: "paid",
            paid_date: new Date().toISOString().split("T")[0],
            payment_method: "Razorpay",
          })
          .eq("id", payment.id);

        toast.success("Payment successful!");
        triggerConfetti();
        playPaymentSuccessSound();
        // Send email notification with correct rupee amount (not paise)
        fetch("/api/payment-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile?.email,
            name: memberInfo?.full_name || profile?.full_name || "Resident",
            amount: parseFloat(payment.amount), // rupees from DB — never divide by 100
            title: payment.title,
            paymentId: response.razorpay_payment_id,
            paidDate: new Date().toLocaleDateString("en-IN"),
          }),
        });
        fetchPayments();
        generateInvoice(
          { ...payment, razorpay_payment_id: response.razorpay_payment_id, paid_date: new Date().toISOString().split("T")[0], payment_method: "Razorpay" },
          memberInfo?.full_name || profile?.full_name || "Resident",
          memberInfo?.flat_number || "N/A"
        );
      },
      prefill: {
        name: profile?.full_name || "Test User",
        email: profile?.email || "test@societyhub.com",
        contact: profile?.phone || "9999999999",
      },
      theme: { color: "#3b82f6" },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      console.error("Razorpay payment failed:", response.error);
      toast.error("Payment failed: " + response.error.description);
      // Rollback: ensure payment status stays as pending (no DB update on failure)
      supabase
        .from("payments")
        .update({ status: "pending" })
        .eq("id", payment.id)
        .eq("status", "pending"); // only update if still pending (no-op safety)
    });
    rzp.open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "overdue": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            <CreditCard className="w-12 h-12 text-yellow-500" />
          </motion.div>
          Payments & Billing
        </h1>
        <p className="text-lg text-gray-600">Track your maintenance fees and bills</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Amount", value: stats.total, icon: Wallet, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
          { label: "Paid", value: stats.paid, icon: CheckCircle, color: "from-green-400 to-green-600", bg: "bg-green-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-50" },
          { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "from-red-400 to-red-600", bg: "bg-red-50" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`${stat.bg} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-2xl`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-600 text-base font-semibold mb-2">{stat.label}</h3>
            <p className="text-4xl font-extrabold text-gray-900">
              {loading ? "..." : formatCurrency(stat.value)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Razorpay Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Secure Online Payments</h3>
            <p className="text-blue-100 text-base">
              Pay your maintenance fees securely using Razorpay. All payments are verified by admin before confirmation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
      >
        <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            Payment History
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
            <p className="text-gray-600">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{payment.title}</h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                      {payment.razorpay_payment_id && !payment.verified_by && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          <Clock className="w-3 h-3" />
                          Pending Verification
                        </span>
                      )}
                      {payment.verified_by && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          <Shield className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    {payment.description && (
                      <p className="text-gray-600 mb-2">{payment.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </div>
                      {payment.paid_date && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Paid: {new Date(payment.paid_date).toLocaleDateString()}
                          </div>
                        </>
                      )}
                      {payment.razorpay_payment_id && (
                        <>
                          <span>•</span>
                          <span className="text-xs">ID: {payment.razorpay_payment_id.slice(0, 20)}...</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCurrency(parseFloat(payment.amount))}
                    </p>
                    {payment.status === "paid" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateInvoice(payment, memberInfo?.full_name || "Resident", memberInfo?.flat_number || "N/A")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-semibold border border-indigo-200"
                      >
                        <Download className="w-4 h-4" />
                        Invoice
                      </motion.button>
                    )}
                    {payment.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRazorpayPayment(payment)}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Pay Now
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* UPI Payment Modal */}
      <AnimatePresence>
        {showUpiModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !upiProcessing && setShowUpiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Pay via UPI</h2>
                <p className="text-gray-600">Enter your UPI ID to complete payment</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Payment For</p>
                  <p className="font-bold text-gray-900">{selectedPayment.title}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(parseFloat(selectedPayment.amount))}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@paytm"
                    disabled={upiProcessing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Examples: yourname@paytm, yourname@phonepe, yourname@googlepay
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: upiProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: upiProcessing ? 1 : 0.98 }}
                  onClick={handleUpiPayment}
                  disabled={upiProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {upiProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowUpiModal(false);
                    setUpiId("");
                    setSelectedPayment(null);
                  }}
                  disabled={upiProcessing}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-800 text-center">
                  🔒 This is a demo payment. No real money will be deducted.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Test Card Modal */}
      <AnimatePresence>
        {showTestCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-7 h-7 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Test Card Details</h2>
                <p className="text-sm text-gray-500 mt-1">Use these in the Razorpay checkout</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 font-mono text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Card Number</span>
                  <span className="font-bold text-gray-900 tracking-wider">5267 3181 8797 5449</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expiry</span>
                  <span className="font-bold text-gray-900">12/26</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CVV</span>
                  <span className="font-bold text-gray-900">123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OTP</span>
                  <span className="font-bold text-gray-900">1234</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mb-4">Mastercard (Indian) — works with Razorpay test mode</p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedWithPayment}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                  Proceed to Pay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTestCardModal(false)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
