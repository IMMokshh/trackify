"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { SOCIETY } from "@/lib/societyConfig";
import { BASE_EVENTS } from "@/lib/eventsData";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  AlertCircle,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Bell,
  MessageSquare,
  Activity,
  Megaphone,
  Pin,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    openIssues: 0,
    pendingPayments: 0,
    upcomingBookings: 0,
    recentVisitors: 0,
  });
  const [userRole, setUserRole] = useState("Resident");
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [showPaymentBanner, setShowPaymentBanner] = useState(false);
  const [paymentDueDate, setPaymentDueDate] = useState<string>("");

  const fetchStats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberData } = await supabase
      .from("society_members")
      .select("full_name, flat_number, badge")
      .eq("email", user.email)
      .single();

    const badge = memberData?.badge || "Resident";
    setUserRole(badge);

    // Run all count queries in parallel
    const [
      { count: issuesCount },
      { count: paymentsCount },
      { count: bookingsCount },
      { data: pendingPaymentData },
    ] = await Promise.all([
      supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("payments").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
      supabase.from("amenity_bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("booking_date", new Date().toISOString().split("T")[0]),
      supabase.from("payments").select("due_date").eq("user_id", user.id).eq("status", "pending").order("due_date", { ascending: true }).limit(1),
    ]);

    // Check if payment is due within 7 days
    if (pendingPaymentData && pendingPaymentData.length > 0) {
      const dueDate = new Date(pendingPaymentData[0].due_date);
      const today = new Date();
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7 && diffDays >= 0) {
        setShowPaymentBanner(true);
        setPaymentDueDate(dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
      }
    }

    let visitorsCount = 0;
    if (memberData?.flat_number) {
      const { count } = await supabase
        .from("visitor_passes")
        .select("*", { count: "exact", head: true })
        .eq("flat_number", memberData.flat_number)
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      visitorsCount = count || 0;
    }

    setStats({
      openIssues: issuesCount || 0,
      pendingPayments: paymentsCount || 0,
      upcomingBookings: bookingsCount || 0,
      recentVisitors: visitorsCount,
    });

    const role = badge.toLowerCase();
    if (role === "chairwoman" || role === "chairman") {
      setGreeting(`${issuesCount || 0} issue${(issuesCount || 0) !== 1 ? "s" : ""} need your attention.`);
    } else if (role === "secretary") {
      setGreeting(`You have ${paymentsCount || 0} pending payment approval${(paymentsCount || 0) !== 1 ? "s" : ""}.`);
    } else if (role === "guard") {
      setGreeting(`${visitorsCount} active visitor pass${visitorsCount !== 1 ? "es" : ""} right now.`);
    } else {
      setGreeting(`You have ${bookingsCount || 0} upcoming booking${(bookingsCount || 0) !== 1 ? "s" : ""}.`);
    }

    setLoading(false);
  }, []);

  const fetchRecentNotices = useCallback(async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);
    setRecentNotices(data || []);
  }, []);

  const fetchUpcomingEvents = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    // Read custom events from localStorage (same key used by admin)
    let allEvents = [...BASE_EVENTS];
    try {
      const saved = localStorage.getItem("society_events");
      if (saved) {
        const custom: any[] = JSON.parse(saved);
        const deletedIds = new Set(custom.filter(e => e._deleted).map(e => e.id));
        const overrides = new Map(custom.filter(e => !e._deleted && BASE_EVENTS.some(b => b.id === e.id)).map(e => [e.id, e]));
        const newCustom = custom.filter(e => !e._deleted && !BASE_EVENTS.some(b => b.id === e.id));
        allEvents = [
          ...BASE_EVENTS.filter(e => !deletedIds.has(e.id)).map(e => overrides.has(e.id) ? { ...overrides.get(e.id) } : e),
          ...newCustom,
        ];
      }
    } catch {}
    const upcoming = allEvents
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
    setUpcomingEvents(upcoming);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRecentNotices();
    fetchUpcomingEvents();
  }, [fetchStats, fetchRecentNotices, fetchUpcomingEvents]);
  const statCards = [
    {
      icon: AlertCircle,
      label: "Open Issues",
      value: stats.openIssues,
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      href: "/dashboard/issues",
    },
    {
      icon: CreditCard,
      label: "Pending Payments",
      value: stats.pendingPayments,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      href: "/dashboard/payments",
    },
    {
      icon: Calendar,
      label: "Upcoming Bookings",
      value: stats.upcomingBookings,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      href: "/dashboard/amenities",
    },
    {
      icon: Users,
      label: "Recent Visitors",
      value: stats.recentVisitors,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      href: "/dashboard/visitors",
    },
  ];

  const quickActions = [
    { icon: AlertCircle, label: "Report Issue", href: "/dashboard/issues", color: "from-red-400 to-red-600" },
    { icon: Calendar, label: "Book Amenity", href: "/dashboard/amenities", color: "from-blue-400 to-blue-600" },
    { icon: Users, label: "Register Visitor", href: "/dashboard/visitors", color: "from-green-400 to-green-600" },
    { icon: MessageSquare, label: "Community Chat", href: "/dashboard/chat", color: "from-cyan-400 to-cyan-600" },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Payment Due Banner */}
      <AnimatePresence>
        {showPaymentBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Payment Due Soon</h3>
                <p className="text-sm text-amber-700">
                  You have a pending payment due on {paymentDueDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/payments">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                  Pay Now
                </motion.button>
              </Link>
              <button
                onClick={() => setShowPaymentBanner(false)}
                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
            Dashboard
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10 text-yellow-500" />
            </motion.div>
          </h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening in <span className="font-semibold text-blue-600">{SOCIETY.shortName}</span>.</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          whileHover={{ scale: 1.2 }}
          className="cursor-pointer"
        >
          <Bell className="w-10 h-10 text-blue-600" />
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`${stat.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-300 group relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className={`w-6 h-6 ${stat.textColor}`} />
                  </motion.div>
                </div>
                <h3 className="text-gray-600 text-base font-semibold mb-2">{stat.label}</h3>
                <p className={`text-5xl font-extrabold ${stat.textColor}`}>
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.08, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-6 rounded-2xl transition-all cursor-pointer border-2 border-white/20 hover:border-white/40 group"
                  >
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} inline-block mb-4 group-hover:scale-110 transition-transform shadow-xl`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-base mb-2">{action.label}</p>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[
              { icon: Clock, text: "March maintenance due by 10th", time: "Today", color: "from-red-400 to-red-600" },
              { icon: Bell, text: "AGM scheduled for 30th March 2026", time: "2 hrs ago", color: "from-amber-400 to-orange-500" },
              { icon: MessageSquare, text: "Purva Chavan posted in Community", time: "5 min ago", color: "from-cyan-400 to-cyan-600" },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all cursor-pointer group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Announcements & Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Announcements</h2>
            </div>
            <Link href="/dashboard/notices">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotices.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No announcements yet</p>
              </div>
            ) : (
              recentNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95 + index * 0.05 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className={`p-4 rounded-xl transition-all cursor-pointer ${
                    notice.pinned ? "bg-orange-50 border-2 border-orange-200" : "bg-gray-50 hover:bg-orange-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notice.pinned ? "bg-orange-500" : "bg-gray-400"} flex-shrink-0`}>
                      {notice.pinned ? (
                        <Pin className="w-4 h-4 text-white" />
                      ) : (
                        <Bell className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{notice.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <Link href="/dashboard/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95 + index * 0.05 }}
                  whileHover={{ x: -8, scale: 1.02 }}
                  className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                      </span>
                      <span className="text-white text-lg font-black">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{event.name}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {event.location}
                      </p>
                      <p className="text-xs text-purple-600 font-semibold mt-1 capitalize">{event.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Society Fund - Recent Transactions */}
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl font-extrabold mb-3 flex items-center gap-3"
          >
            Welcome back, {userRole}!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-blue-100 text-lg mb-6 max-w-3xl"
          >
            {greeting || "Your all-in-one community management platform. Explore features, connect with neighbors, and manage your society efficiently."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 60px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all"
            >
              Explore Features
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:border-white/60 transition-all"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
