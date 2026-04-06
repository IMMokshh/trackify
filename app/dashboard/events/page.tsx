"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Sparkles, Users, Clock, MapPin, CheckCircle, User, Flag, Star } from "lucide-react";
import { BASE_EVENTS, type EventType } from "@/lib/eventsData";

const TYPE_CONFIG: Record<EventType, { label: string; bg: string; text: string; border: string; grad: string; icon: any }> = {
  festival: { label: "Festival",      bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   grad: "from-pink-500 to-rose-600",    icon: Sparkles },
  national: { label: "National",      bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", grad: "from-orange-500 to-amber-600",  icon: Flag },
  cultural: { label: "Cultural",      bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", grad: "from-purple-500 to-violet-600", icon: Star },
  society:  { label: "Society Event", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   grad: "from-blue-500 to-indigo-600",   icon: Users },
};

const FILTERS = ["all", "festival", "national", "cultural", "society"];
const FILTER_LABELS: Record<string, string> = { all: "All Events", festival: "Festivals", national: "National", cultural: "Cultural", society: "Society" };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [attending, setAttending] = useState<Set<number>>(new Set());
  const [allEvents, setAllEvents] = useState(BASE_EVENTS);

  useEffect(() => {
    const saved = localStorage.getItem("society_events");
    if (saved) {
      try {
        const custom: any[] = JSON.parse(saved);
        const deletedIds = new Set(custom.filter(e => e._deleted).map(e => e.id));
        const overrides = custom.filter(e => !e._deleted && e.custom && BASE_EVENTS.some(b => b.id === e.id));
        const overrideIds = new Set(overrides.map(e => e.id));
        const newCustom = custom.filter(e => !e._deleted && !BASE_EVENTS.some(b => b.id === e.id));
        const merged = [
          ...BASE_EVENTS.filter(e => !deletedIds.has(e.id) && !overrideIds.has(e.id)),
          ...overrides,
          ...newCustom,
        ];
        setAllEvents(merged);
      } catch {}
    }
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = useMemo(() => [...allEvents].sort((a, b) => a.date.localeCompare(b.date)), [allEvents]);
  const filtered = useMemo(() => filter === "all" ? sorted : sorted.filter(e => e.type === filter), [filter, sorted]);
  const upcoming = filtered.filter(e => new Date(e.date) >= today);
  const past = filtered.filter(e => new Date(e.date) < today);
  const nextEvent = sorted.find(e => new Date(e.date) >= today);

  const toggleAttend = (id: number) => {
    setAttending(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </motion.div>
          Events Calendar 2026
        </h1>
        <p className="text-gray-500 mt-1">{allEvents.length} events - festivals, national days and society activities</p>
      </motion.div>

      {/* Next Event Banner */}
      {nextEvent && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 border-2 flex items-center gap-4 ${TYPE_CONFIG[nextEvent.type].bg} ${TYPE_CONFIG[nextEvent.type].border}`}>
          <div className={`w-14 h-14 bg-gradient-to-br ${TYPE_CONFIG[nextEvent.type].grad} rounded-xl flex flex-col items-center justify-center shadow-md flex-shrink-0`}>
            <span className="text-white text-xs font-bold leading-none">{new Date(nextEvent.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</span>
            <span className="text-white text-xl font-black leading-tight">{new Date(nextEvent.date).getDate()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Next Event</p>
            <p className={`font-extrabold text-base ${TYPE_CONFIG[nextEvent.type].text}`}>{nextEvent.name}</p>
            <p className="text-xs text-gray-500">{fmtDate(nextEvent.date)} - {nextEvent.location}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${TYPE_CONFIG[nextEvent.type].bg} ${TYPE_CONFIG[nextEvent.type].text} ${TYPE_CONFIG[nextEvent.type].border}`}>
            {TYPE_CONFIG[nextEvent.type].label}
          </span>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Upcoming ({upcoming.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((event, i) => {
              const cfg = TYPE_CONFIG[event.type];
              const Icon = cfg.icon;
              const isAttending = attending.has(event.id);
              return (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(168,85,247,0.12)" }}
                  className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${cfg.border} hover:border-purple-300 transition-all`}>
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${cfg.grad} rounded-xl flex flex-col items-center justify-center shadow-md flex-shrink-0`}>
                      <span className="text-white text-xs font-bold leading-none">{new Date(event.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</span>
                      <span className="text-white text-xl font-black leading-tight">{new Date(event.date).getDate()}</span>
                      <span className="text-white/80 text-xs leading-none">{new Date(event.date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 leading-snug">{event.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border inline-flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-3 h-3" />{cfg.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => toggleAttend(event.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isAttending ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}>
                    {isAttending ? <><CheckCircle className="w-4 h-4" /> Attending</> : <><User className="w-4 h-4" /> Mark as Attending</>}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-400 mb-3">Past Events ({past.length})</h2>
          <div className="space-y-2">
            {past.map(event => {
              const cfg = TYPE_CONFIG[event.type];
              const Icon = cfg.icon;
              return (
                <div key={event.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-700 text-sm">{event.name}</h3>
                      <p className="text-xs text-gray-500">{fmtDate(event.date)} - {event.location}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No events found for this filter.</p>
        </div>
      )}
    </div>
  );
}
