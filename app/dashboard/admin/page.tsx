"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { SOCIETY } from "@/lib/societyConfig";
import {
  Shield,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  FileText,
  Zap,
  TrendingUp,
  Users,
  AlertCircle,
  CreditCard,
  Trash2,
  AlertTriangle,
  Search,
  Edit2,
  X,
  Crown,
  Star,
  Wallet,
  IndianRupee,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
  User,
  Clock,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { BASE_EVENTS } from "@/lib/eventsData";
import { toast } from "@/lib/toast";

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null);
  const [societyBills, setSocietyBills] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [sosAlerts, setSOSAlerts] = useState<any[]>([]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [newBill, setNewBill] = useState({
    bill_type: "",
    vendor_name: "",
    bill_number: "",
    amount: "",
    due_date: "",
    notes: "",
  });

  const [issues, setIssues] = useState<any[]>([]);
  const [issueSearch, setIssueSearch] = useState("");

  // Society Fund state
  const [fundTransactions, setFundTransactions] = useState<any[]>([]);
  const [fundBudget, setFundBudget] = useState(500000);
  const [fundBudgetInput, setFundBudgetInput] = useState("500000");
  const [showFundAddModal, setShowFundAddModal] = useState(false);
  const [fundForm, setFundForm] = useState({ title: "", type: "debit", category: "Maintenance", amount: "", date: new Date().toISOString().split("T")[0], description: "", status: "Approved", addedBy: "Admin" });
  const FUND_CATEGORIES = ["Maintenance", "Events", "Repairs", "Utilities", "Other"];

  // Events Management state
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null); // null = add mode, object = edit mode
  const [eventSearch, setEventSearch] = useState("");
  const emptyEventForm = { name: "", date: "", type: "society", description: "", location: "", time: "6:00 PM" };
  const [eventForm, setEventForm] = useState({ ...emptyEventForm });
  const EVENT_TYPES = ["festival", "national", "cultural", "society"];

  const [members, setMembers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const emptyMember = { full_name: "", email: "", phone: "", flat_number: "", family_members: "1", badge: "Resident", has_parking: false, parking_slot: "", has_pets: false, pets_count: "0" };
  const [memberForm, setMemberForm] = useState({ ...emptyMember });

  useEffect(() => {
    checkAdmin();
    fetchData();
    fetchMembers();
    fetchIssues();
    loadFundData();
    loadEventsData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data?.role !== "admin") {
      toast.error("Access denied. Admin only.");
      window.location.href = "/dashboard";
    }
    setProfile(data);
  };

  const fetchData = async () => {
    const { data: bills } = await supabase
      .from("society_bills")
      .select("*")
      .order("due_date", { ascending: false });

    const { data: payments } = await supabase
      .from("payments")
      .select(`
        *,
        profiles:user_id (full_name, flat_number, email)
      `)
      .not("razorpay_payment_id", "is", null)
      .is("verified_by", null)
      .order("paid_date", { ascending: false });

    const { data: alerts } = await supabase
      .from("sos_alerts")
      .select(`
        *,
        profiles:user_id (full_name, flat_number)
      `)
      .order("created_at", { ascending: false });

    setSocietyBills(bills || []);
    setPendingPayments(payments || []);
    setSOSAlerts(alerts || []);
  };

  const addSocietyBill = async () => {
    await supabase.from("society_bills").insert(newBill);
    setShowAddBillModal(false);
    setNewBill({ bill_type: "", vendor_name: "", bill_number: "", amount: "", due_date: "", notes: "" });
    fetchData();
  };

  const paySocietyBill = async () => {
    if (!selectedBill) return;

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(selectedBill.amount),
          receipt: `bill_${selectedBill.id}`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error("Failed to create payment order");
        return;
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SHfqpTs7Rj3LnD",
          amount: parseFloat(selectedBill.amount) * 100,
          currency: "INR",
          name: "Society Hub",
          description: `${selectedBill.bill_type} - ${selectedBill.vendor_name}`,
          order_id: orderData.order.id,
          handler: async (response: any) => {
            // Payment successful - update bill
            const { data: { user } } = await supabase.auth.getUser();
            
            await supabase
              .from("society_bills")
              .update({
                status: "paid",
                paid_date: new Date().toISOString().split("T")[0],
                paid_by: user?.id,
                payment_reference: response.razorpay_payment_id,
                receipt_url: `https://razorpay.com/payment/${response.razorpay_payment_id}`,
              })
              .eq("id", selectedBill.id);

            toast.success("Bill payment successful!");
            setShowPayBillModal(false);
            setSelectedBill(null);
            setPaymentReference("");
            fetchData();
          },
          prefill: {
            name: profile?.full_name,
            email: profile?.email,
            contact: profile?.phone,
          },
          theme: {
            color: "#3b82f6",
          },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const verifyPayment = async () => {
    if (!selectedPayment) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from("payments")
      .update({
        verified_by: user?.id,
        verified_at: new Date().toISOString(),
        verification_notes: verificationNotes,
      })
      .eq("id", selectedPayment.id);

    setShowVerifyModal(false);
    setSelectedPayment(null);
    setVerificationNotes("");
    fetchData();
  };

  const rejectPayment = async () => {
    if (!selectedPayment) return;

    await supabase
      .from("payments")
      .update({
        status: "pending",
        razorpay_payment_id: null,
        razorpay_order_id: null,
        razorpay_signature: null,
        paid_date: null,
      })
      .eq("id", selectedPayment.id);

    setShowVerifyModal(false);
    setSelectedPayment(null);
    fetchData();
  };

  // Load Society Fund data from localStorage (shared with user side)
  const loadFundData = () => {
    const saved = localStorage.getItem("sf_transactions");
    const savedBudget = localStorage.getItem("sf_budget");
    if (saved) setFundTransactions(JSON.parse(saved));
    if (savedBudget) { setFundBudget(Number(savedBudget)); setFundBudgetInput(savedBudget); }
  };

  const persistFund = (data: any[]) => {
    setFundTransactions(data);
    localStorage.setItem("sf_transactions", JSON.stringify(data));
  };

  const addFundTransaction = () => {
    if (!fundForm.title.trim() || !fundForm.amount || isNaN(Number(fundForm.amount))) {
      toast.error("Fill title and valid amount.");
      return;
    }
    const updated = [{ ...fundForm, id: Date.now(), amount: parseFloat(fundForm.amount) }, ...fundTransactions];
    persistFund(updated);
    toast.success("Transaction added!");
    setShowFundAddModal(false);
    setFundForm({ title: "", type: "debit", category: "Maintenance", amount: "", date: new Date().toISOString().split("T")[0], description: "", status: "Approved", addedBy: "Admin" });
  };

  const updateFundStatus = (id: number, status: string) => {
    persistFund(fundTransactions.map(t => t.id === id ? { ...t, status } : t));
    toast.success(`Marked as ${status}`);
  };

  const deleteFundTransaction = (id: number) => {
    persistFund(fundTransactions.filter(t => t.id !== id));
    toast.info("Transaction removed.");
  };

  const saveFundBudget = () => {
    const val = parseFloat(fundBudgetInput);
    if (!isNaN(val) && val > 0) {
      setFundBudget(val);
      localStorage.setItem("sf_budget", String(val));
      toast.success("Budget updated!");
    }
  };

  const loadEventsData = () => {
    const saved = localStorage.getItem("society_events");
    if (saved) setCustomEvents(JSON.parse(saved));
  };

  const persistEvents = (data: any[]) => {
    setCustomEvents(data);
    localStorage.setItem("society_events", JSON.stringify(data));
  };

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ ...emptyEventForm });
    setShowAddEventModal(true);
  };

  const openEditEvent = (ev: any) => {
    setEditingEvent(ev);
    setEventForm({ name: ev.name, date: ev.date, type: ev.type, description: ev.description || "", location: ev.location || "", time: ev.time || "6:00 PM" });
    setShowAddEventModal(true);
  };

  const saveEvent = () => {
    if (!eventForm.name.trim() || !eventForm.date) {
      toast.error("Name and date are required.");
      return;
    }
    if (editingEvent) {
      // editing: if it's a custom event update in-place, if base event save as override in customEvents
      const isCustom = customEvents.some((e) => e.id === editingEvent.id);
      if (isCustom) {
        persistEvents(customEvents.map((e) => e.id === editingEvent.id ? { ...e, ...eventForm } : e));
      } else {
        // base event override: store with same id so events page can merge/override
        const existing = customEvents.find((e) => e.id === editingEvent.id);
        if (existing) {
          persistEvents(customEvents.map((e) => e.id === editingEvent.id ? { ...e, ...eventForm } : e));
        } else {
          persistEvents([...customEvents, { ...editingEvent, ...eventForm, custom: true }]);
        }
      }
      toast.success("Event updated!");
    } else {
      persistEvents([...customEvents, { ...eventForm, id: Date.now(), custom: true }]);
      toast.success("Event added!");
    }
    setShowAddEventModal(false);
    setEditingEvent(null);
    setEventForm({ ...emptyEventForm });
  };

  const deleteCustomEvent = (id: number) => {
    if (!confirm("Remove this event?")) return;
    persistEvents(customEvents.filter((e) => e.id !== id));
    toast.info("Event removed.");
  };

  const deleteAnyEvent = (ev: any) => {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    const isCustom = customEvents.some((e) => e.id === ev.id);
    if (isCustom) {
      persistEvents(customEvents.filter((e) => e.id !== ev.id));
    } else {
      // mark base event as deleted by storing a tombstone
      persistEvents([...customEvents, { ...ev, _deleted: true }]);
    }
    toast.info("Event removed.");
  };

  const fetchIssues = async () => {
    const { data } = await supabase
      .from("issues")
      .select(`*, profiles:created_by (full_name, flat_number)`)
      .order("created_at", { ascending: false });
    setIssues(data || []);
  };

  const resolveIssue = async (id: string) => {
    await supabase.from("issues").update({ status: "resolved" }).eq("id", id);
    fetchIssues();
  };

  const markInProgress = async (id: string) => {
    await supabase.from("issues").update({ status: "in_progress" }).eq("id", id);
    fetchIssues();
  };

  const deleteIssue = async (id: string) => {
    if (!confirm("Delete this issue permanently?")) return;
    await supabase.from("issues").delete().eq("id", id);
    fetchIssues();
  };

  const fetchMembers = async () => {
    const { data } = await supabase.from("society_members").select("*").order("flat_number", { ascending: true });
    setMembers(data || []);
  };

  const saveMember = async (isEdit: boolean) => {
    setMemberLoading(true);
    try {
      const payload = {
        full_name: memberForm.full_name,
        email: memberForm.email,
        phone: memberForm.phone,
        flat_number: memberForm.flat_number,
        family_members: parseInt(memberForm.family_members) || 1,
        badge: memberForm.badge,
        has_parking: memberForm.has_parking,
        parking_slot: memberForm.parking_slot || null,
        has_pets: memberForm.has_pets,
        pets_count: parseInt(memberForm.pets_count) || 0,
      };
      if (isEdit && selectedMember) {
        await supabase.from("society_members").update(payload).eq("id", selectedMember.id);
        setShowEditMemberModal(false);
      } else {
        await supabase.from("society_members").insert(payload);
        setShowAddMemberModal(false);
      }
      setMemberForm({ ...emptyMember });
      setSelectedMember(null);
      fetchMembers();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setMemberLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("society_members").delete().eq("id", id);
    fetchMembers();
  };

  const getRoleBadgeColor = (badge: string) => {
    switch (badge) {
      case "Secretary": return "from-yellow-400 to-yellow-600";
      case "Treasurer": return "from-blue-400 to-blue-600";
      case "Committee": return "from-red-400 to-red-600";
      default: return "from-green-400 to-green-600";
    }
  };

  const sendWhatsAppReminder = (payment: any) => {
    const name = payment.profiles?.full_name || "Resident";
    const flat = payment.profiles?.flat_number || "";
    const amount = formatCurrency(parseFloat(payment.amount));
    const title = payment.title || "Maintenance";
    const msg = `Hi ${name} (Flat ${flat}), this is a reminder that your *${title}* payment of *${amount}* is pending. Please pay at your earliest via the ${SOCIETY.appName} app. Thank you!`;
    const phone = payment.profiles?.phone?.replace(/\D/g, "") || "";
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const deleteSOSAlert = async (alertId: string) => {
    if (!confirm("Are you sure you want to delete this SOS alert?")) return;

    const { error } = await supabase
      .from("sos_alerts")
      .delete()
      .eq("id", alertId);

    if (!error) {
      fetchData();
    }
  };

  if (!profile || profile.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3 flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-2xl shadow-xl"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg ml-1">Manage society bills and verify payments</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 rounded-3xl p-8 shadow-2xl border border-orange-200 hover:shadow-orange-500/30 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-xl">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Pending Verifications</h3>
          <p className="text-5xl font-extrabold text-gray-900">{pendingPayments.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-3xl p-8 shadow-2xl border border-blue-200 hover:shadow-blue-500/30 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Society Bills</h3>
          <p className="text-5xl font-extrabold text-gray-900">{societyBills.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-3xl p-8 shadow-2xl border border-green-200 hover:shadow-green-500/30 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Pending Bills</h3>
          <p className="text-5xl font-extrabold text-gray-900">
            {societyBills.filter(b => b.status === "pending").length}
          </p>
        </motion.div>
      </div>

      {/* Pending Payment Verifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-orange-500" />
          Pending Payment Verifications
        </h2>
        {pendingPayments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No pending verifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{payment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {payment.profiles?.full_name} ({payment.profiles?.flat_number})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment ID: {payment.razorpay_payment_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCurrency(parseFloat(payment.amount))}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendWhatsAppReminder(payment)}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowVerifyModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm shadow-lg"
                      >
                        Verify Payment
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Society Bills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Society Bills
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddBillModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Bill
          </motion.button>
        </div>
        <div className="space-y-4">
          {societyBills.map((bill) => (
            <div
              key={bill.id}
              className={`p-4 rounded-xl border-2 ${
                bill.status === "paid"
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{bill.bill_type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bill.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{bill.vendor_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(bill.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {formatCurrency(parseFloat(bill.amount))}
                  </p>
                  {bill.status === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedBill(bill);
                        setShowPayBillModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Pay Now
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Members Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Members Management
          </h2>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setMemberForm({ ...emptyMember }); setShowAddMemberModal(true); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Member
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
            placeholder="Search by name, flat, email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {members.filter(m =>
            m.full_name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.flat_number?.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.email?.toLowerCase().includes(memberSearch.toLowerCase())
          ).map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{member.full_name}</p>
                  <p className="text-sm text-gray-500">{member.flat_number} • {member.email || "No email"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRoleBadgeColor(member.badge)}`}>
                  {member.badge || "Resident"}
                </span>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setSelectedMember(member); setMemberForm({ full_name: member.full_name || "", email: member.email || "", phone: member.phone || "", flat_number: member.flat_number || "", family_members: String(member.family_members || 1), badge: member.badge || "Resident", has_parking: member.has_parking || false, parking_slot: member.parking_slot || "", has_pets: member.has_pets || false, pets_count: String(member.pets_count || 0) }); setShowEditMemberModal(true); }}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                  <Edit2 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => deleteMember(member.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              No members yet. Add your first member.
            </div>
          )}
        </div>
      </motion.div>

      {/* Issues Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
        className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          Issues Management
        </h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={issueSearch} onChange={e => setIssueSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {issues.filter(i =>
            i.title?.toLowerCase().includes(issueSearch.toLowerCase()) ||
            i.profiles?.full_name?.toLowerCase().includes(issueSearch.toLowerCase())
          ).map(issue => (
            <div key={issue.id} className={`flex items-center justify-between p-4 rounded-xl border ${issue.status === "resolved" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-bold text-gray-900 truncate">{issue.title}</p>
                <p className="text-sm text-gray-500">
                  {issue.profiles?.full_name} ({issue.profiles?.flat_number}) •{" "}
                  <span className={`font-semibold ${issue.status === "resolved" ? "text-green-600" : issue.status === "open" ? "text-red-600" : "text-yellow-600"}`}>
                    {issue.status.replace("_", " ").toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {issue.status !== "in_progress" && issue.status !== "resolved" && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => markInProgress(issue.id)}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold hover:bg-yellow-200 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> In Progress
                  </motion.button>
                )}
                {issue.status !== "resolved" && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => resolveIssue(issue.id)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Resolve
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => deleteIssue(issue.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              No issues found.
            </div>
          )}
        </div>
      </motion.div>

      {/* Events Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}
        className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-500" />
            Events Management
          </h2>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={openAddEvent}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg font-semibold flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Event
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mb-3">Click any event to edit or delete it. Changes are reflected in the Events Calendar for all residents.</p>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={eventSearch} onChange={e => setEventSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Location</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(() => {
                const deletedIds = new Set(customEvents.filter(e => e._deleted).map(e => e.id));
                const overrideMap = new Map(customEvents.filter(e => !e._deleted && BASE_EVENTS.some(b => b.id === e.id)).map(e => [e.id, e]));
                const newCustom = customEvents.filter(e => !e._deleted && !BASE_EVENTS.some(b => b.id === e.id));
                const allVisible = [
                  ...BASE_EVENTS.filter(e => !deletedIds.has(e.id)).map(e => overrideMap.has(e.id) ? { ...overrideMap.get(e.id), _isOverride: true } : e),
                  ...newCustom,
                ].sort((a, b) => a.date.localeCompare(b.date));

                const filtered = allVisible.filter(e =>
                  e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
                  e.type.toLowerCase().includes(eventSearch.toLowerCase()) ||
                  (e.location || "").toLowerCase().includes(eventSearch.toLowerCase())
                );

                const TYPE_COLORS: Record<string, string> = {
                  festival: "bg-pink-100 text-pink-700",
                  national: "bg-orange-100 text-orange-700",
                  cultural: "bg-purple-100 text-purple-700",
                  society:  "bg-blue-100 text-blue-700",
                };

                if (filtered.length === 0) return (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No events found.</p>
                  </td></tr>
                );

                return filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-purple-50 transition-colors group cursor-pointer"
                    onClick={() => openEditEvent(ev)}>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                      {new Date(ev.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{ev.name}</span>
                      {ev.custom && !ev._isOverride && <span className="ml-2 text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">Custom</span>}
                      {ev._isOverride && <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-semibold">Edited</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${TYPE_COLORS[ev.type] || "bg-gray-100 text-gray-600"}`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{ev.location || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); openEditEvent(ev); }}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <Edit2 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); deleteAnyEvent(ev); }}
                          className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200">
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Society Fund Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}
        className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            Society Fund Management
          </h2>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowFundAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add Transaction
            </motion.button>
          </div>
        </div>

        {/* Budget Control */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" /> Set Annual Budget
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="number" value={fundBudgetInput} onChange={(e) => setFundBudgetInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold" />
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={saveFundBudget}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
              Save
            </motion.button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Credits", value: fundTransactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0), color: "text-emerald-700" },
              { label: "Debits", value: fundTransactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0), color: "text-red-600" },
              { label: "Balance", value: fundTransactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0) - fundTransactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0), color: "text-blue-700" },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-xl p-2">
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className={`text-sm font-extrabold ${c.color}`}>Rs. {c.value.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {fundTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions yet.</p>
            </div>
          ) : fundTransactions.map((tx) => (
            <div key={tx.id} className={`flex items-center justify-between p-3 rounded-xl border group ${tx.type === "credit" ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"}`}>
                  {tx.type === "credit" ? <ArrowUpCircle className="w-4 h-4 text-emerald-600" /> : <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{tx.title}</p>
                  <p className="text-xs text-gray-400">{tx.category} - {tx.date} - by {tx.addedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                  {tx.type === "credit" ? "+" : "-"}Rs. {tx.amount.toLocaleString("en-IN")}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tx.status === "Approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {tx.status}
                </span>
                {tx.status === "Pending" && (
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateFundStatus(tx.id, "Approved")}
                    className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteFundTransaction(tx.id)}
                  className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add / Edit Event Modal */}
      <AnimatePresence>
        {showAddEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddEventModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-5 relative">
                <button onClick={() => setShowAddEventModal(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg">
                  <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-lg font-black text-white">{editingEvent ? "Edit Event" : "Add Custom Event"}</h2>
                <p className="text-purple-100 text-xs mt-1">Visible to all residents in Events Calendar</p>
              </div>
              <div className="p-5 space-y-3">
                <input type="text" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="Event name *"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="Time (e.g. 6:00 PM)"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <div className="relative">
                  <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Location (e.g. Society Lawn)"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Description (optional)" rows={2}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <div className="flex gap-3 pt-1">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={saveEvent}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-bold text-sm">
                    {editingEvent ? "Save Changes" : "Add Event"}
                  </motion.button>
                  <button onClick={() => setShowAddEventModal(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Fund Transaction Modal */}
      <AnimatePresence>
        {showFundAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFundAddModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 relative flex-shrink-0">
                <button onClick={() => setShowFundAddModal(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg">
                  <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-lg font-black text-white">Add Fund Transaction</h2>
                <p className="text-emerald-100 text-xs mt-1">Admin - direct entry</p>
              </div>
              <div className="p-5 space-y-3 overflow-y-auto">
                <div className="flex gap-2">
                  {["debit", "credit"].map(t => (
                    <button key={t} onClick={() => setFundForm({ ...fundForm, type: t })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${fundForm.type === t ? (t === "credit" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-gray-100 text-gray-600"}`}>
                      {t === "credit" ? "+ Credit" : "- Debit"}
                    </button>
                  ))}
                </div>
                <input type="text" value={fundForm.title} onChange={(e) => setFundForm({ ...fundForm, title: e.target.value })}
                  placeholder="Title *"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={fundForm.amount} onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      placeholder="Amount *"
                      className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <input type="date" value={fundForm.date} onChange={(e) => setFundForm({ ...fundForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div className="relative">
                  <select value={fundForm.category} onChange={(e) => setFundForm({ ...fundForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                    {FUND_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <textarea value={fundForm.description} onChange={(e) => setFundForm({ ...fundForm, description: e.target.value })}
                  placeholder="Description (optional)" rows={2}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <div className="flex gap-3 pt-1">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={addFundTransaction}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold">
                    Add Transaction
                  </motion.button>
                  <button onClick={() => setShowFundAddModal(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Alerts Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          SOS Alerts Management
        </h2>
        {sosAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No SOS alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sosAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border-2 ${
                  alert.is_resolved
                    ? "bg-green-50 border-green-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">Emergency Alert</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.is_resolved
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {alert.is_resolved ? "RESOLVED" : "ACTIVE"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      From: {alert.profiles?.full_name} ({alert.profiles?.flat_number})
                    </p>
                    {alert.message && (
                      <p className="text-sm text-gray-700 mb-1">Message: {alert.message}</p>
                    )}
                    {alert.location && (
                      <p className="text-sm text-gray-700 mb-1">Location: {alert.location}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteSOSAlert(alert.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Visitor Pass History — Clear All */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-green-500" />
          Visitor Pass History
        </h2>
        <p className="text-gray-500 text-sm mb-4">Clear all visitor pass records from the database. This removes dummy and test entries.</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            if (!confirm("Delete ALL visitor pass history? This cannot be undone.")) return;
            const { error } = await supabase.from("visitor_passes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
            if (!error) toast.success("Visitor pass history cleared.");
            else toast.error("Failed to clear history.");
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Visitor History
        </motion.button>
      </motion.div>

      {/* Verify Payment Modal */}
      <AnimatePresence>
        {showVerifyModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVerifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Verify Payment</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Payment Title</p>
                  <p className="font-bold text-gray-900">{selectedPayment.title}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-bold text-gray-900 text-2xl">
                    {formatCurrency(parseFloat(selectedPayment.amount))}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Resident</p>
                  <p className="font-bold text-gray-900">
                    {selectedPayment.profiles?.full_name} ({selectedPayment.profiles?.flat_number})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Razorpay Payment ID</p>
                  <p className="font-mono text-sm text-gray-900">{selectedPayment.razorpay_payment_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Notes (Optional)
                  </label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Add any notes about this verification..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyPayment}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Verify & Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={rejectPayment}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVerifyModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Bill Modal */}
      <AnimatePresence>
        {showPayBillModal && selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPayBillModal(false)}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Pay Society Bill</h2>
                <p className="text-gray-600">Confirm payment for this bill</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Bill Type</p>
                  <p className="font-bold text-gray-900">{selectedBill.bill_type}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Vendor</p>
                  <p className="font-bold text-gray-900">{selectedBill.vendor_name}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Bill Number</p>
                  <p className="font-bold text-gray-900">{selectedBill.bill_number}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(parseFloat(selectedBill.amount))}
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-800 text-center">
                    💳 You will be redirected to Razorpay to complete the payment
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={paySocietyBill}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay via Razorpay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowPayBillModal(false);
                    setSelectedBill(null);
                    setPaymentReference("");
                  }}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Bill Modal */}
      <AnimatePresence>
        {showAddBillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddBillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Add Society Bill</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
                    <input
                      type="text"
                      value={newBill.bill_type}
                      onChange={(e) => setNewBill({ ...newBill, bill_type: e.target.value })}
                      placeholder="e.g., Electricity, Water"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      value={newBill.vendor_name}
                      onChange={(e) => setNewBill({ ...newBill, vendor_name: e.target.value })}
                      placeholder="Vendor/Service provider"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number</label>
                    <input
                      type="text"
                      value={newBill.bill_number}
                      onChange={(e) => setNewBill({ ...newBill, bill_number: e.target.value })}
                      placeholder="Bill reference number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newBill.due_date}
                    onChange={(e) => setNewBill({ ...newBill, due_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newBill.notes}
                    onChange={(e) => setNewBill({ ...newBill, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addSocietyBill}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg"
                  >
                    Add Bill
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddBillModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Add / Edit Member Modal */}
      <AnimatePresence>
        {(showAddMemberModal || showEditMemberModal) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddMemberModal(false); setShowEditMemberModal(false); }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{showEditMemberModal ? "Edit Member" : "Add New Member"}</h2>
                <button onClick={() => { setShowAddMemberModal(false); setShowEditMemberModal(false); }} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name *", key: "full_name", type: "text", placeholder: "John Doe" },
                  { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Flat Number *", key: "flat_number", type: "text", placeholder: "A-101" },
                  { label: "Family Members", key: "family_members", type: "number", placeholder: "1" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
                    <input type={f.type} value={(memberForm as any)[f.key]}
                      onChange={e => setMemberForm({ ...memberForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Role/Badge</label>
                  <select value={memberForm.badge} onChange={e => setMemberForm({ ...memberForm, badge: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Resident">Resident</option>
                    <option value="Committee">Committee</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Secretary">Secretary</option>
                  </select>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={memberForm.has_parking} onChange={e => setMemberForm({ ...memberForm, has_parking: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Has Parking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={memberForm.has_pets} onChange={e => setMemberForm({ ...memberForm, has_pets: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Has Pets</span>
                  </label>
                </div>
                {memberForm.has_parking && (
                  <input value={memberForm.parking_slot} onChange={e => setMemberForm({ ...memberForm, parking_slot: e.target.value })}
                    placeholder="Parking slot (e.g. P-12)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
                {memberForm.has_pets && (
                  <input type="number" value={memberForm.pets_count} onChange={e => setMemberForm({ ...memberForm, pets_count: e.target.value })}
                    placeholder="Number of pets"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => saveMember(showEditMemberModal)} disabled={memberLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
                  {memberLoading ? "Saving..." : showEditMemberModal ? "Save Changes" : "Add Member"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowAddMemberModal(false); setShowEditMemberModal(false); }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
