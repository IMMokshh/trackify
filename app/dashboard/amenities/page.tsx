"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Calendar, Plus, Clock, Users, Dumbbell, Waves, Home as HomeIcon,
  CheckCircle, XCircle, Star, Sparkles, X, ChevronRight,
} from "lucide-react";

const AMENITY_COLORS: Record<string, string> = {
  gym: "from-orange-400 to-red-500",
  pool: "from-cyan-400 to-blue-500",
  club: "from-purple-400 to-indigo-500",
  default: "from-green-400 to-teal-500",
};

const AMENITY_BG: Record<string, string> = {
  gym: "from-orange-50 to-red-50",
  pool: "from-cyan-50 to-blue-50",
  club: "from-purple-50 to-indigo-50",
  default: "from-green-50 to-teal-50",
};

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [bookingData, setBookingData] = useState({ date: "", startTime: "", endTime: "", notes: "" });
  const [booked, setBooked] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: amenitiesData } = await supabase.from("amenities").select("*").eq("is_active", true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: bookingsData } = await supabase
        .from("amenity_bookings")
        .select(`*, amenities (name)`)
        .eq("user_id", user.id)
        .order("booking_date", { ascending: false });
      setBookings(bookingsData || []);
    }
    setAmenities(amenitiesData || []);
    setLoading(false);
  };

  const bookAmenity = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedAmenity) return;
    const { error } = await supabase.from("amenity_bookings").insert({
      amenity_id: selectedAmenity.id,
      user_id: user.id,
      booking_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      notes: bookingData.notes,
      total_amount: selectedAmenity.price_per_hour,
    });
    if (!error) {
      setBooked(true);
      setTimeout(() => {
        setShowBookModal(false);
        setBooked(false);
        setBookingData({ date: "", startTime: "", endTime: "", notes: "" });
        fetchData();
      }, 1500);
    }
  };

  const getKey = (name: string) => {
    if (name.toLowerCase().includes("gym")) return "gym";
    if (name.toLowerCase().includes("pool")) return "pool";
    if (name.toLowerCase().includes("club")) return "club";
    return "default";
  };

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("gym")) return Dumbbell;
    if (name.toLowerCase().includes("pool")) return Waves;
    if (name.toLowerCase().includes("club")) return HomeIcon;
    return Calendar;
  };

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-xl">
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            Amenity Booking
          </h1>
          <p className="text-gray-500 ml-1">Book clubhouse, gym, pool and more</p>
        </div>
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl px-5 py-3">
          <Star className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-semibold text-purple-700">{amenities.length} amenities available</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Amenities", value: amenities.length, color: "from-purple-500 to-indigo-600" },
          { label: "My Bookings", value: bookings.length, color: "from-blue-500 to-cyan-600" },
          { label: "Approved", value: bookings.filter(b => b.status === "approved").length, color: "from-green-500 to-emerald-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-xl`}>
            <p className="text-white/70 text-xs font-semibold mb-1">{stat.label}</p>
            <p className="text-4xl font-extrabold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Amenities Grid */}
      {loading ? (
        <div className="text-center py-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => {
            const key = getKey(amenity.name);
            const Icon = getIcon(amenity.name);
            const isFree = amenity.is_free || amenity.price_per_hour === 0;
            const requiresBooking = amenity.requires_booking !== false && !isFree;
            return (
              <motion.div key={amenity.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${AMENITY_BG[key]} rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all border-2 border-white group relative overflow-hidden ${requiresBooking ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => { if (requiresBooking) { setSelectedAmenity(amenity); setShowBookModal(true); } }}>
                <motion.div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-4 bg-gradient-to-br ${AMENITY_COLORS[key]} rounded-2xl shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {isFree ? (
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">FREE</span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Bookable</span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">{amenity.name}</h3>
                  {amenity.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{amenity.description}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-white/60">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {amenity.capacity || "N/A"}</span>
                    </div>
                    {isFree ? (
                      <span className="text-lg font-extrabold text-emerald-600">Free</span>
                    ) : (
                      <span className="text-lg font-extrabold text-purple-600">Rs. {amenity.price_per_hour}/hr</span>
                    )}
                  </div>
                  {isFree ? (
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                      <span>No booking required</span>
                    </div>
                  ) : (
                    <motion.div whileHover={{ x: 4 }} className="mt-4 flex items-center gap-2 text-purple-600 font-semibold text-sm">
                      <span>Book Now — contributes to society fund</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* My Bookings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl"><Clock className="w-6 h-6 text-purple-600" /></div>
          My Bookings
        </h2>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No bookings yet. Book an amenity above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, index) => (
              <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded-xl"><Calendar className="w-5 h-5 text-purple-600" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.amenities?.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(booking.booking_date).toLocaleDateString('en-IN')} - {booking.start_time} to {booking.end_time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  booking.status === "approved" ? "bg-green-100 text-green-700" :
                  booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"}`}>
                  {booking.status?.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Book Modal */}
      <AnimatePresence>
        {showBookModal && selectedAmenity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
              {booked ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-8">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Requested!</h3>
                  <p className="text-gray-500">Your booking is pending approval.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-br ${AMENITY_COLORS[getKey(selectedAmenity.name)]} rounded-xl`}>
                        {(() => { const Icon = getIcon(selectedAmenity.name); return <Icon className="w-6 h-6 text-white" />; })()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Book {selectedAmenity.name}</h2>
                        <p className="text-sm text-gray-500">Rs. {selectedAmenity.price_per_hour}/hr — booking fee goes to society fund</p>
                      </div>
                    </div>
                    <button onClick={() => setShowBookModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <input type="date" value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input type="time" value={bookingData.startTime} onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input type="time" value={bookingData.endTime} onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                      <textarea value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        rows={3} placeholder="Any special requirements..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={bookAmenity}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" /> Confirm Booking
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowBookModal(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
