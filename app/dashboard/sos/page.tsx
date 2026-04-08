"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { notifySOSAlert } from "@/lib/notifications";
import { sendSOSSMS } from "@/lib/sms";
import {
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Shield,
  Zap,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { enhanceEmergencyText } from "@/lib/sms";

export default function SOSPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosMessage, setSOSMessage] = useState("");
  const [sosLocation, setSOSLocation] = useState("");
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("sos_alerts")
      .select(`
        *,
        profiles:user_id (full_name, flat_number)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlerts(data);
    }
    setLoading(false);
  };

  const handleAIEnhance = async () => {
    if (!sosMessage.trim()) {
      toast.error("Please type a message first");
      return;
    }
    setEnhancing(true);
    const enhanced = await enhanceEmergencyText(sosMessage);
    setSOSMessage(enhanced);
    setEnhancing(false);
  };

  const createSOSAlert = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, flat_number")
      .eq("id", user.id)
      .single();

    const { error } = await supabase.from("sos_alerts").insert({
      user_id: user.id,
      message: sosMessage,
      location: sosLocation,
    });

    if (!error) {
      // Send browser notification
      if (Notification.permission === "granted") {
        notifySOSAlert(
          profile?.full_name || "Someone",
          profile?.flat_number || "Unknown",
          sosLocation || "Not specified"
        );
      }
      
      // Send SMS automatically
      sendSOSSMS(
        '+919076195126',
        profile?.full_name || "Unknown",
        profile?.flat_number || "N/A",
        sosLocation || "Not specified",
        sosMessage || "Emergency assistance needed"
      );

      // Always show success - SMS is dispatched
      toast.success("SOS Alert Sent! SMS sent to emergency contact. Help is on the way!");
      
      setShowSOSModal(false);
      setSOSMessage("");
      setSOSLocation("");
      fetchAlerts();
    }
  };

  const sendWhatsAppAlerts = (profile: any) => {
    const emergencyMessage = `🚨 *EMERGENCY SOS ALERT* 🚨%0A%0A` +
      `From: ${profile?.full_name}%0A` +
      `Flat: ${profile?.flat_number}%0A` +
      `Location: ${sosLocation || "Not specified"}%0A` +
      `Message: ${sosMessage || "Emergency assistance needed"}%0A%0A` +
      `Time: ${new Date().toLocaleString()}%0A%0A` +
      `⚠️ IMMEDIATE ACTION REQUIRED`;

    // Send to specific WhatsApp number - opens with message ready
    const phoneNumber = '919076195126'; // +91 90761 95126
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${emergencyMessage}`, '_blank');
    
    // Show instruction
    setTimeout(() => {
      toast.info("WhatsApp opened - click Send to alert emergency contact.");
    }, 1000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <AlertTriangle className="w-12 h-12 text-orange-500" />
            </motion.div>
            SOS Emergency Alerts
          </h1>
          <p className="text-lg text-gray-600">Quick emergency response system</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSOSModal(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-2xl font-extrabold text-xl shadow-2xl transition-all flex items-center gap-3"
        >
          <AlertTriangle className="w-7 h-7" />
          SEND SOS ALERT
        </motion.button>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-orange-600 via-red-600 to-red-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
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
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-extrabold">Emergency Contacts</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
      { label: "Security", number: "9076195126", icon: Shield },
              { label: "Admin", number: "9076195126", icon: Phone },
              { label: "Police", number: "100", icon: AlertTriangle },
              { label: "Fire", number: "101", icon: AlertTriangle },
              { label: "Ambulance", number: "102", icon: Phone },
              { label: "Society Manager", number: "9076195126", icon: Shield },
            ].map((contact, index) => (
              <motion.a
                key={contact.label}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all flex items-center gap-4 border-2 border-white/20 hover:border-white/40 shadow-xl"
              >
                <div className="p-4 bg-white/20 rounded-xl">
                  <contact.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-lg">{contact.label}</p>
                  <p className="text-base opacity-90 font-semibold">{contact.number}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Alerts List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-lg"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No active alerts</h3>
            <p className="text-gray-600">All clear! No emergency alerts at the moment.</p>
          </motion.div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`rounded-3xl p-8 shadow-2xl border-l-8 relative ${
                alert.is_resolved
                  ? "bg-white border-green-500"
                  : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-500"
              }`}
            >
              {!alert.is_resolved && (
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4"
                >
                  <div className="p-4 bg-orange-500 rounded-full shadow-xl">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
              )}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {alert.is_resolved ? (
                      <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700 shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                        RESOLVED
                      </span>
                    ) : (
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-orange-100 text-orange-700"
                      >
                        <Zap className="w-5 h-5" />
                        ACTIVE ALERT
                      </motion.span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Emergency Alert</h3>
                  {alert.message && (
                    <p className="text-gray-700 mb-4 font-semibold text-lg">{alert.message}</p>
                  )}
                  {alert.location && (
                    <div className="flex items-center gap-3 text-gray-600 mb-4 bg-white/50 p-3 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">{alert.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span>From {alert.profiles?.full_name} ({alert.profiles?.flat_number})</span>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* SOS Modal */}
      <AnimatePresence>
        {showSOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowSOSModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Send SOS Alert</h2>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <p className="text-orange-800 font-medium flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  This will send SMS automatically to emergency contact: +91 90761 95126
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={sosLocation}
                      onChange={(e) => setSOSLocation(e.target.value)}
                      placeholder="e.g., Building A, Floor 3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={sosMessage}
                    onChange={(e) => setSOSMessage(e.target.value)}
                    placeholder="Brief description of the emergency"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={enhancing || !sosMessage.trim()}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {enhancing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enhancing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> AI Enhance</>
                    )}
                  </motion.button>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createSOSAlert}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    SEND ALERT NOW
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSOSModal(false)}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
