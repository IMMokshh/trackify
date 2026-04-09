"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIETY } from "@/lib/societyConfig";
import AriaAssistant from "@/components/AriaAssistant";
import {
  Home,
  AlertCircle,
  AlertTriangle,
  Users,
  CreditCard,
  Calendar,
  CalendarDays,
  FileText,
  MessageSquare,
  Bell,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Car,
  Phone,
  Vote,
  ShoppingBag,
  ShieldCheck,
  Wrench,
  Wallet,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [memberBadge, setMemberBadge] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  // Stable ref so subscription callback always calls latest fetchNotifications
  const fetchNotificationsRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const { data: sosAlerts } = await supabase
      .from("sos_alerts")
      .select(`*, profiles:user_id (full_name, flat_number)`)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .limit(10);

    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: recentIssues } = await supabase
      .from("issues")
      .select(`*, profiles:created_by (full_name, flat_number)`)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5);

    const sosNotifs = (sosAlerts || []).map((alert: any) => ({
      id: `sos-${alert.id}`,
      type: "sos",
      title: "SOS Emergency Alert",
      message: `${alert.profiles?.full_name} (${alert.profiles?.flat_number}) needs help!`,
      location: alert.location,
      time: alert.created_at,
      urgent: true,
      href: "/dashboard/sos",
    }));

    const issueNotifs = (recentIssues || []).map((issue: any) => ({
      id: `issue-${issue.id}`,
      type: "issue",
      title: "Issue Reported",
      message: `${issue.profiles?.full_name} reported: ${issue.title}. Click here to check.`,
      time: issue.created_at,
      urgent: false,
      href: "/dashboard/issues",
    }));

    const allNotifs = [...sosNotifs, ...issueNotifs].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    setNotifications(allNotifs);
    setUnreadCount(allNotifs.length);
  }, []);

  // Keep ref in sync with latest callback
  useEffect(() => {
    fetchNotificationsRef.current = fetchNotifications;
  }, [fetchNotifications]);

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profile);

    const { data: member } = await supabase
      .from("society_members")
      .select("badge")
      .eq("email", user.email)
      .single();
    setMemberBadge(member?.badge || "");
  }, [router]);

  useEffect(() => {
    checkUser();
    fetchNotifications();

    const sosSubscription = supabase
      .channel("sos_alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sos_alerts" }, () => {
        fetchNotificationsRef.current();
      })
      .subscribe();

    const issuesSubscription = supabase
      .channel("issues_notif")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "issues" }, () => {
        fetchNotificationsRef.current();
      })
      .subscribe();

    return () => {
      sosSubscription.unsubscribe();
      issuesSubscription.unsubscribe();
    };
  }, [checkUser, fetchNotifications]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login"); // replace clears dashboard from history
  }, [router]);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", color: "from-blue-400 to-blue-600" },
    { icon: AlertCircle, label: "Issues", href: "/dashboard/issues", color: "from-red-400 to-red-600" },
    { icon: AlertTriangle, label: "SOS Alerts", href: "/dashboard/sos", color: "from-orange-400 to-orange-600" },
    { icon: Users, label: "Visitors", href: "/dashboard/visitors", color: "from-green-400 to-green-600" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/payments", color: "from-yellow-400 to-yellow-600" },
    { icon: Calendar, label: "Amenities", href: "/dashboard/amenities", color: "from-purple-400 to-purple-600" },
    { icon: CalendarDays, label: "Events", href: "/dashboard/events", color: "from-pink-500 to-rose-600" },
    { icon: Wrench, label: "Services & Partners", href: "/dashboard/services", color: "from-indigo-500 to-violet-600" },
    { icon: Wallet, label: "Society Fund", href: "/dashboard/society-fund", color: "from-emerald-500 to-teal-600" },
    { icon: FileText, label: "Documents", href: "/dashboard/documents", color: "from-indigo-400 to-indigo-600" },
    { icon: MessageSquare, label: "Chat", href: "/dashboard/chat", color: "from-cyan-400 to-cyan-600" },
    { icon: Vote, label: "Polls & Voting", href: "/dashboard/polls", color: "from-indigo-500 to-purple-700" },
    { icon: ShoppingBag, label: "Marketplace", href: "/dashboard/marketplace", color: "from-orange-500 to-red-600" },
    { icon: Bell, label: "Notices", href: "/dashboard/notices", color: "from-pink-400 to-pink-600" },
    { icon: User, label: "Members", href: "/dashboard/members", color: "from-blue-400 to-blue-600" },
    { icon: Car, label: "Parking", href: "/dashboard/parking", color: "from-purple-500 to-purple-700" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", color: "from-teal-400 to-teal-600" },
  ];

  // Add admin menu item if user is admin
  const adminMenuItem = profile?.role === "admin"
    ? { icon: User, label: "Admin Panel", href: "/dashboard/admin", color: "from-blue-600 to-indigo-700" }
    : null;

  const adminMapItem = profile?.role === "admin"
    ? { icon: BarChart3, label: "Issue Map", href: "/dashboard/admin/map", color: "from-indigo-500 to-purple-600" }
    : null;

  // Guard panel: visible to guard role and authority roles
  const GUARD_ROLES = ["Guard", "Chairwoman", "Chairman", "Secretary", "Committee", "Treasurer"];
  const guardMenuItem = GUARD_ROLES.includes(memberBadge)
    ? { icon: ShieldCheck, label: "Guard Panel", href: "/dashboard/guard", color: "from-slate-500 to-slate-700" }
    : null;

  const allMenuItems = [
    ...menuItems,
    ...(adminMenuItem ? [adminMenuItem] : []),
    ...(adminMapItem ? [adminMapItem] : []),
    ...(guardMenuItem ? [guardMenuItem] : []),
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex" style={{ isolation: "auto" }}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-gradient-primary text-white shadow-2xl overflow-hidden h-screen sticky top-0">
        <div className="p-6 flex flex-col h-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                <img src="/logo.png" alt="Trackify" className="w-8 h-8 object-contain" />
                Trackify
              </h1>
            <p className="text-blue-200 text-sm">Community Management</p>
            <p className="text-blue-300 text-xs mt-0.5 leading-tight">{SOCIETY.shortName}</p>
          </motion.div>

          {profile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{profile.full_name}</p>
                  <p className="text-sm text-blue-200">{profile.flat_number}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  {memberBadge || (profile.role === 'admin' ? 'Admin' : 'Resident')}
                </span>
                <ChevronRight className="w-4 h-4 text-blue-200" />
              </div>
            </motion.div>
          )}

          <nav className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {allMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-blue-600 shadow-lg"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-400/30 flex-shrink-0"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>

          {/* CK branding — sidebar footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-300">
            <img src="/cklogoshort.png" alt="ContractKillers" className="h-4 w-auto object-contain" />
            <span className="text-white/60 text-[10px] font-light tracking-wide">ContractKillers</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-primary text-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                      <img src="/logo.png" alt="Trackify" className="w-8 h-8 object-contain" />
                      Trackify
                    </h1>
                    <p className="text-blue-200 text-sm">Community Management</p>
                    <p className="text-blue-300 text-xs mt-0.5 leading-tight">{SOCIETY.shortName}</p>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {profile && (
                  <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{profile.full_name}</p>
                        <p className="text-sm text-blue-200">{profile.flat_number}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
                      {memberBadge || (profile.role === 'admin' ? 'Admin' : 'Resident')}
                    </span>
                  </div>
                )}

                <nav className="space-y-2">
                  {allMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-white text-blue-600 shadow-lg"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="mt-6 w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-400/30"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>

                {/* CK branding — mobile sidebar footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-300">
                  <img src="/cklogoshort.png" alt="ContractKillers" className="h-4 w-auto object-contain" />
                  <span className="text-white/60 text-[10px] font-light tracking-wide">ContractKillers</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header with Notification Bell */}
        <div className="hidden lg:flex bg-white shadow-sm p-4 items-center justify-end sticky top-0 z-40">
          {/* Notification Bell - Desktop */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </motion.div>
              )}
            </motion.button>

            {/* Notification Dropdown - Desktop */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] max-h-96 overflow-y-auto"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.href}
                          onClick={() => setShowNotifications(false)}
                        >
                          <motion.div
                            whileHover={{ backgroundColor: notif.type === "sos" ? "#FEF2F2" : "#FFFBEB" }}
                            className={`p-4 cursor-pointer ${notif.type === "sos" ? "bg-red-50" : "bg-orange-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                animate={notif.type === "sos" ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="flex-shrink-0"
                              >
                                {notif.type === "sos" ? (
                                  <AlertTriangle className="w-6 h-6 text-red-500" />
                                ) : (
                                  <AlertCircle className="w-6 h-6 text-orange-500" />
                                )}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${notif.type === "sos" ? "text-red-700" : "text-orange-700"}`}>{notif.title}</p>
                                <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                                {notif.location && (
                                  <p className="text-gray-500 text-xs mt-1">Location: {notif.location}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(notif.time).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="bg-gradient-primary text-white p-2 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <img src="/logo.png" alt="Trackify" className="w-7 h-7 object-contain" />
            Trackify
          </h1>
          
          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </motion.div>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] max-h-96 overflow-y-auto"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.href}
                          onClick={() => setShowNotifications(false)}
                        >
                          <motion.div
                            whileHover={{ backgroundColor: notif.type === "sos" ? "#FEF2F2" : "#FFFBEB" }}
                            className={`p-4 cursor-pointer ${notif.type === "sos" ? "bg-red-50" : "bg-orange-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                animate={notif.type === "sos" ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="flex-shrink-0"
                              >
                                {notif.type === "sos" ? (
                                  <AlertTriangle className="w-6 h-6 text-red-500" />
                                ) : (
                                  <AlertCircle className="w-6 h-6 text-orange-500" />
                                )}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${notif.type === "sos" ? "text-red-700" : "text-orange-700"}`}>{notif.title}</p>
                                <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                                {notif.location && (
                                  <p className="text-gray-500 text-xs mt-1">Location: {notif.location}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(notif.time).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 relative">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transform: "none" }}
          >
            {children}
          </motion.div>
          
          {/* Subtle Branding */}
          <div className="fixed bottom-3 right-3 opacity-20 hover:opacity-50 transition-opacity duration-300 pointer-events-none select-none z-10">
            <img src="/cklogoshort.png" alt="CK" className="h-4 w-auto object-contain" style={{ filter: "grayscale(1)" }} />
          </div>
        </main>

        {/* Aria Assistant */}
        <AriaAssistant />
      </div>
    </div>
  );
}
