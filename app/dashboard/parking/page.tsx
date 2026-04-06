"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Search, Filter, MapPin, User, Phone, CheckCircle, XCircle, X, IndianRupee } from "lucide-react";

// G+14 building, 4 wings (A/B/C/D), 4 flats per floor = 56 residential + 8 visitor slots
const SLOTS = [
  // Wing A
  { id: 1,  slot_number: "A-01", owner_name: "Moksh Sonar",       flat_number: "A-301", is_available: false, rent_price: 0,    vehicle: "MH 05 PM 1316", type: "4W" },
  { id: 2,  slot_number: "A-02", owner_name: "Yash Bandawane",    flat_number: "A-302", is_available: false, rent_price: 0,    vehicle: "MH-12 CD 5678", type: "4W" },
  { id: 3,  slot_number: "A-03", owner_name: "Rajesh Kumar",      flat_number: "A-101", is_available: false, rent_price: 0,    vehicle: "MH-12 PQ 1122", type: "4W" },
  { id: 4,  slot_number: "A-04", owner_name: "Sunita Rao",        flat_number: "A-102", is_available: true,  rent_price: 2000, vehicle: "-",              type: "2W" },
  { id: 5,  slot_number: "A-05", owner_name: "Deepak Nair",       flat_number: "A-201", is_available: false, rent_price: 0,    vehicle: "MH-12 RS 3344", type: "4W" },
  { id: 6,  slot_number: "A-06", owner_name: "Meena Pillai",      flat_number: "A-202", is_available: true,  rent_price: 1800, vehicle: "-",              type: "2W" },
  { id: 7,  slot_number: "A-07", owner_name: "Amit Patel",        flat_number: "A-401", is_available: false, rent_price: 0,    vehicle: "MH-12 TU 5566", type: "4W" },
  { id: 8,  slot_number: "A-08", owner_name: "Kavita Singh",      flat_number: "A-402", is_available: true,  rent_price: 2100, vehicle: "-",              type: "4W" },
  { id: 9,  slot_number: "A-09", owner_name: "Rahul Mehta",       flat_number: "A-501", is_available: false, rent_price: 0,    vehicle: "MH-12 VW 7788", type: "4W" },
  { id: 10, slot_number: "A-10", owner_name: "Pooja Iyer",        flat_number: "A-502", is_available: true,  rent_price: 1900, vehicle: "-",              type: "2W" },
  { id: 11, slot_number: "A-11", owner_name: "Suresh Patil",      flat_number: "A-601", is_available: false, rent_price: 0,    vehicle: "MH-12 XY 9900", type: "4W" },
  { id: 12, slot_number: "A-12", owner_name: "Anita Kulkarni",    flat_number: "A-602", is_available: false, rent_price: 0,    vehicle: "MH-12 ZA 1010", type: "2W" },
  { id: 13, slot_number: "A-13", owner_name: "Nikhil Joshi",      flat_number: "A-701", is_available: true,  rent_price: 2200, vehicle: "-",              type: "4W" },
  { id: 14, slot_number: "A-14", owner_name: "Rekha Sharma",      flat_number: "A-702", is_available: false, rent_price: 0,    vehicle: "MH-12 BC 2020", type: "4W" },
  // Wing B
  { id: 15, slot_number: "B-01", owner_name: "Purva Chavan",      flat_number: "B-303", is_available: false, rent_price: 0,    vehicle: "MH 05 MP 1316", type: "4W" },
  { id: 16, slot_number: "B-02", owner_name: "Priya Sharma",      flat_number: "B-402", is_available: false, rent_price: 0,    vehicle: "MH-12 FG 4040", type: "4W" },
  { id: 17, slot_number: "B-03", owner_name: "Sneha Desai",       flat_number: "B-503", is_available: true,  rent_price: 1900, vehicle: "-",              type: "2W" },
  { id: 18, slot_number: "B-04", owner_name: "Vikram Joshi",      flat_number: "B-101", is_available: false, rent_price: 0,    vehicle: "MH-12 HI 5050", type: "2W" },
  { id: 19, slot_number: "B-05", owner_name: "Lalita Menon",      flat_number: "B-102", is_available: true,  rent_price: 2000, vehicle: "-",              type: "4W" },
  { id: 20, slot_number: "B-06", owner_name: "Ganesh Rao",        flat_number: "B-201", is_available: false, rent_price: 0,    vehicle: "MH-12 JK 6060", type: "4W" },
  { id: 21, slot_number: "B-07", owner_name: "Hema Nair",         flat_number: "B-202", is_available: true,  rent_price: 1800, vehicle: "-",              type: "2W" },
  { id: 22, slot_number: "B-08", owner_name: "Ravi Tiwari",       flat_number: "B-401", is_available: false, rent_price: 0,    vehicle: "MH-12 LM 7070", type: "4W" },
  { id: 23, slot_number: "B-09", owner_name: "Sonal Gupta",       flat_number: "B-601", is_available: false, rent_price: 0,    vehicle: "MH-12 NO 8080", type: "4W" },
  { id: 24, slot_number: "B-10", owner_name: "Arun Verma",        flat_number: "B-602", is_available: true,  rent_price: 2300, vehicle: "-",              type: "4W" },
  { id: 25, slot_number: "B-11", owner_name: "Divya Krishnan",    flat_number: "B-701", is_available: false, rent_price: 0,    vehicle: "MH-12 PQ 9090", type: "2W" },
  { id: 26, slot_number: "B-12", owner_name: "Manoj Bhatt",       flat_number: "B-702", is_available: true,  rent_price: 2000, vehicle: "-",              type: "4W" },
  { id: 27, slot_number: "B-13", owner_name: "Usha Pandey",       flat_number: "B-801", is_available: false, rent_price: 0,    vehicle: "MH-12 RS 1111", type: "4W" },
  { id: 28, slot_number: "B-14", owner_name: "Kiran Bose",        flat_number: "B-802", is_available: true,  rent_price: 1700, vehicle: "-",              type: "2W" },
  // Wing C
  { id: 29, slot_number: "C-01", owner_name: "Tanmay Kolekar",    flat_number: "C-704", is_available: false, rent_price: 0,    vehicle: "MH-12 EF 9012", type: "2W" },
  { id: 30, slot_number: "C-02", owner_name: "Ashok Reddy",       flat_number: "C-101", is_available: false, rent_price: 0,    vehicle: "MH-12 TU 2222", type: "4W" },
  { id: 31, slot_number: "C-03", owner_name: "Nalini Shetty",     flat_number: "C-102", is_available: true,  rent_price: 2000, vehicle: "-",              type: "4W" },
  { id: 32, slot_number: "C-04", owner_name: "Prakash Hegde",     flat_number: "C-201", is_available: false, rent_price: 0,    vehicle: "MH-12 VW 3333", type: "4W" },
  { id: 33, slot_number: "C-05", owner_name: "Shobha Kamath",     flat_number: "C-202", is_available: true,  rent_price: 1800, vehicle: "-",              type: "2W" },
  { id: 34, slot_number: "C-06", owner_name: "Vinod Naik",        flat_number: "C-301", is_available: false, rent_price: 0,    vehicle: "MH-12 XY 4444", type: "4W" },
  { id: 35, slot_number: "C-07", owner_name: "Geeta Sawant",      flat_number: "C-302", is_available: false, rent_price: 0,    vehicle: "MH-12 ZA 5555", type: "2W" },
  { id: 36, slot_number: "C-08", owner_name: "Harish Pawar",      flat_number: "C-401", is_available: true,  rent_price: 2100, vehicle: "-",              type: "4W" },
  { id: 37, slot_number: "C-09", owner_name: "Smita Gaikwad",     flat_number: "C-501", is_available: false, rent_price: 0,    vehicle: "MH-12 BC 6666", type: "4W" },
  { id: 38, slot_number: "C-10", owner_name: "Dilip More",        flat_number: "C-502", is_available: true,  rent_price: 1900, vehicle: "-",              type: "2W" },
  { id: 39, slot_number: "C-11", owner_name: "Varsha Jadhav",     flat_number: "C-601", is_available: false, rent_price: 0,    vehicle: "MH-12 DE 7777", type: "4W" },
  { id: 40, slot_number: "C-12", owner_name: "Santosh Mane",      flat_number: "C-602", is_available: false, rent_price: 0,    vehicle: "MH-12 FG 8888", type: "4W" },
  { id: 41, slot_number: "C-13", owner_name: "Rohini Bhosale",    flat_number: "C-701", is_available: true,  rent_price: 2200, vehicle: "-",              type: "4W" },
  { id: 42, slot_number: "C-14", owner_name: "Ajay Shinde",       flat_number: "C-702", is_available: false, rent_price: 0,    vehicle: "MH-12 HI 9999", type: "2W" },
  // Wing D
  { id: 43, slot_number: "D-01", owner_name: "Aryan Chauhan",     flat_number: "D-502", is_available: false, rent_price: 0,    vehicle: "MH-12 GH 3456", type: "4W" },
  { id: 44, slot_number: "D-02", owner_name: "Neha Thakur",       flat_number: "D-101", is_available: true,  rent_price: 2000, vehicle: "-",              type: "4W" },
  { id: 45, slot_number: "D-03", owner_name: "Sanjay Dubey",      flat_number: "D-102", is_available: false, rent_price: 0,    vehicle: "MH-12 JK 1212", type: "4W" },
  { id: 46, slot_number: "D-04", owner_name: "Asha Tripathi",     flat_number: "D-201", is_available: true,  rent_price: 1800, vehicle: "-",              type: "2W" },
  { id: 47, slot_number: "D-05", owner_name: "Mukesh Yadav",      flat_number: "D-202", is_available: false, rent_price: 0,    vehicle: "MH-12 LM 2323", type: "4W" },
  { id: 48, slot_number: "D-06", owner_name: "Sunita Mishra",     flat_number: "D-301", is_available: false, rent_price: 0,    vehicle: "MH-12 NO 3434", type: "2W" },
  { id: 49, slot_number: "D-07", owner_name: "Ramesh Tiwari",     flat_number: "D-302", is_available: true,  rent_price: 2100, vehicle: "-",              type: "4W" },
  { id: 50, slot_number: "D-08", owner_name: "Lata Pandey",       flat_number: "D-401", is_available: false, rent_price: 0,    vehicle: "MH-12 PQ 4545", type: "4W" },
  { id: 51, slot_number: "D-09", owner_name: "Vijay Saxena",      flat_number: "D-402", is_available: true,  rent_price: 1900, vehicle: "-",              type: "2W" },
  { id: 52, slot_number: "D-10", owner_name: "Mala Srivastava",   flat_number: "D-501", is_available: false, rent_price: 0,    vehicle: "MH-12 RS 5656", type: "4W" },
  { id: 53, slot_number: "D-11", owner_name: "Anil Gupta",        flat_number: "D-601", is_available: false, rent_price: 0,    vehicle: "MH-12 TU 6767", type: "4W" },
  { id: 54, slot_number: "D-12", owner_name: "Seema Kapoor",      flat_number: "D-602", is_available: true,  rent_price: 2300, vehicle: "-",              type: "4W" },
  { id: 55, slot_number: "D-13", owner_name: "Pankaj Aggarwal",   flat_number: "D-701", is_available: false, rent_price: 0,    vehicle: "MH-12 VW 7878", type: "2W" },
  { id: 56, slot_number: "D-14", owner_name: "Ritu Malhotra",     flat_number: "D-702", is_available: true,  rent_price: 2000, vehicle: "-",              type: "4W" },
  // Visitor Parking
  { id: 57, slot_number: "V-01", owner_name: "Visitor",           flat_number: "-",     is_available: true,  rent_price: 0,    vehicle: "-",              type: "4W" },
  { id: 58, slot_number: "V-02", owner_name: "Visitor",           flat_number: "-",     is_available: false, rent_price: 0,    vehicle: "MH-12 XX 0001", type: "4W" },
  { id: 59, slot_number: "V-03", owner_name: "Visitor",           flat_number: "-",     is_available: true,  rent_price: 0,    vehicle: "-",              type: "2W" },
  { id: 60, slot_number: "V-04", owner_name: "Visitor",           flat_number: "-",     is_available: false, rent_price: 0,    vehicle: "MH-12 XX 0002", type: "2W" },
  { id: 61, slot_number: "V-05", owner_name: "Visitor",           flat_number: "-",     is_available: true,  rent_price: 0,    vehicle: "-",              type: "4W" },
  { id: 62, slot_number: "V-06", owner_name: "Visitor",           flat_number: "-",     is_available: true,  rent_price: 0,    vehicle: "-",              type: "2W" },
  { id: 63, slot_number: "V-07", owner_name: "Visitor",           flat_number: "-",     is_available: false, rent_price: 0,    vehicle: "MH-12 XX 0003", type: "4W" },
  { id: 64, slot_number: "V-08", owner_name: "Visitor",           flat_number: "-",     is_available: true,  rent_price: 0,    vehicle: "-",              type: "4W" },
];

export default function ParkingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const filtered = SLOTS.filter((s) => {
    const matchSearch = s.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slot_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "all" || (filterStatus === "available" && s.is_available) || (filterStatus === "occupied" && !s.is_available);
    return matchSearch && matchFilter;
  });

  const available = SLOTS.filter(s => s.is_available).length;
  const occupied = SLOTS.filter(s => !s.is_available).length;

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-4">
            <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-xl">
              <Car className="w-10 h-10 text-white" />
            </motion.div>
            Stilt Parking
          </h1>
          <p className="text-gray-500 ml-1">View and rent available parking slots</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Slots", value: SLOTS.length, color: "from-blue-500 to-indigo-600", icon: Car },
          { label: "Available", value: available, color: "from-green-500 to-emerald-600", icon: CheckCircle },
          { label: "Occupied", value: occupied, color: "from-red-500 to-rose-600", icon: XCircle },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-semibold mb-1">{s.label}</p>
                <p className="text-4xl font-extrabold">{s.value}</p>
              </div>
              <s.icon className="w-12 h-12 text-white/20" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual slot map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-500" /> Parking Layout
        </h2>
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {[
            { wing: "A", color: "text-violet-700", border: "border-violet-200", bg: "bg-violet-50" },
            { wing: "B", color: "text-blue-700",   border: "border-blue-200",   bg: "bg-blue-50"   },
            { wing: "C", color: "text-emerald-700",border: "border-emerald-200",bg: "bg-emerald-50"},
            { wing: "D", color: "text-orange-700", border: "border-orange-200", bg: "bg-orange-50" },
            { wing: "V", color: "text-gray-600",   border: "border-gray-200",   bg: "bg-gray-50"   },
          ].map(({ wing, color, border, bg }) => {
            const wingSlots = SLOTS.filter(s => s.slot_number.startsWith(wing + "-"));
            return (
              <div key={wing} className={`rounded-2xl p-3 border ${border} ${bg}`}>
                <p className={`text-xs font-bold mb-2 ${color}`}>{wing === "V" ? "Visitor Parking" : `Wing ${wing}`}</p>
                <div className="grid grid-cols-7 gap-2">
                  {wingSlots.map((slot) => (
                    <motion.button key={slot.id} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedSlot(slot)}
                      title={`${slot.slot_number} - ${slot.owner_name}`}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold shadow-sm transition-all ${
                        slot.is_available
                          ? "bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200"
                          : "bg-red-100 text-red-700 border-2 border-red-200"
                      }`}>
                      <Car className="w-3 h-3 mb-0.5" />
                      {slot.slot_number.split("-")[1]}
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-200 rounded border-2 border-green-300" /><span>Available</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-200 rounded border-2 border-red-200" /><span>Occupied</span></div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by owner, flat, slot..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white">
            <option value="all">All Slots</option>
            <option value="available">Available for Rent</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((slot, index) => (
          <motion.div key={slot.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 cursor-pointer ${
              slot.is_available
                ? "bg-gradient-to-br from-white to-green-50 border-green-200 hover:border-green-400"
                : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
            }`}
            onClick={() => setSelectedSlot(slot)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${slot.is_available ? "bg-green-100" : "bg-gray-200"}`}>
                  <Car className={`w-6 h-6 ${slot.is_available ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">{slot.slot_number}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${slot.is_available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {slot.is_available ? "Available" : "Occupied"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{slot.type}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{slot.owner_name}</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>Flat {slot.flat_number}</span></div>
              {!slot.is_available && <div className="flex items-center gap-2"><Car className="w-4 h-4" /><span className="font-mono text-xs">{slot.vehicle}</span></div>}
              {slot.is_available && (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <IndianRupee className="w-4 h-4" /><span>Rs. {slot.rent_price}/month</span>
                </div>
              )}
            </div>
            {slot.is_available && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg">
                Contact Owner
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Slot Detail Modal */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSlot(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectedSlot.is_available ? "bg-green-100" : "bg-gray-200"}`}>
                    <Car className={`w-6 h-6 ${selectedSlot.is_available ? "text-green-600" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedSlot.slot_number}</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedSlot.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {selectedSlot.is_available ? "Available for Rent" : "Occupied"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedSlot(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs font-semibold text-blue-500 mb-2">OWNER DETAILS</p>
                  <p className="font-bold text-gray-900">{selectedSlot.owner_name}</p>
                  <p className="text-gray-600 text-sm">Flat {selectedSlot.flat_number}</p>
                </div>
                {!selectedSlot.is_available && (
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 mb-2">VEHICLE</p>
                    <p className="font-bold font-mono text-gray-900">{selectedSlot.vehicle}</p>
                    <p className="text-gray-500 text-sm">{selectedSlot.type === "4W" ? "4 Wheeler" : "2 Wheeler"}</p>
                  </div>
                )}
                {selectedSlot.is_available && (
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <p className="text-xs font-semibold text-green-600 mb-2">RENT PRICE</p>
                    <p className="text-3xl font-extrabold text-green-700">Rs. {selectedSlot.rent_price}<span className="text-base font-normal text-green-500">/month</span></p>
                  </div>
                )}
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <p className="text-xs font-semibold text-purple-500 mb-2">CONTACT ADMIN</p>
                  <a href="tel:9076195126" className="flex items-center gap-2 text-purple-700 font-bold text-lg">
                    <Phone className="w-5 h-5" /> 90761 95126
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
