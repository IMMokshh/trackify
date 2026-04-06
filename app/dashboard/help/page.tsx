"use client";

import { motion } from "framer-motion";
import { Phone, Wrench, Zap, Droplet, Paintbrush, Car, ShoppingCart, Stethoscope, Flame, Shield, AlertTriangle, Search, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

const EMERGENCY = [
  { icon: AlertTriangle, name: "Police", number: "100", color: "from-red-500 to-red-700", desc: "Law & Order" },
  { icon: Flame, name: "Fire Brigade", number: "101", color: "from-orange-500 to-orange-700", desc: "Fire Emergency" },
  { icon: Stethoscope, name: "Ambulance", number: "102", color: "from-green-500 to-green-700", desc: "Medical Emergency" },
  { icon: Shield, name: "Society Security", number: "9876543200", color: "from-blue-500 to-blue-700", desc: "24/7 On-site" },
];

const SERVICES = [
  { icon: Wrench, name: "Plumber", person: "Rajesh Kumar", number: "9876543210", service: "24/7 Available", color: "from-blue-400 to-blue-600", tag: "Plumbing" },
  { icon: Zap, name: "Electrician", person: "Ramesh Patil", number: "9876543211", service: "Emergency Service", color: "from-yellow-400 to-yellow-600", tag: "Electrical" },
  { icon: Paintbrush, name: "Painter", person: "Suresh Yadav", number: "9876543212", service: "Interior & Exterior", color: "from-purple-400 to-purple-600", tag: "Painting" },
  { icon: Wrench, name: "Carpenter", person: "Vijay Singh", number: "9876543213", service: "Furniture Repair", color: "from-amber-500 to-amber-700", tag: "Carpentry" },
  { icon: Car, name: "Car Mechanic", person: "Anil Sharma", number: "9876543214", service: "Doorstep Service", color: "from-gray-600 to-gray-800", tag: "Automotive" },
  { icon: Droplet, name: "Water Tank Cleaning", person: "Sunil Verma", number: "9876543215", service: "Monthly Service", color: "from-cyan-400 to-cyan-600", tag: "Cleaning" },
  { icon: ShoppingCart, name: "Fresh Mart Grocery", person: "Home Delivery", number: "9876543216", service: "Same Day Delivery", color: "from-green-400 to-green-600", tag: "Grocery" },
  { icon: ShoppingCart, name: "MedPlus Pharmacy", person: "24/7 Delivery", number: "9876543217", service: "Medicines & More", color: "from-red-400 to-red-600", tag: "Pharmacy" },
  { icon: Stethoscope, name: "Dr. Mehta", person: "General Physician", number: "9876543218", service: "Home Visits", color: "from-teal-400 to-teal-600", tag: "Medical" },
  { icon: Wrench, name: "Cool Tech AC Repair", person: "Deepak Nair", number: "9876543219", service: "Same Day Service", color: "from-indigo-400 to-indigo-600", tag: "AC/Appliances" },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(number);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredServices = SERVICES.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-4">
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-xl">
            <Phone className="w-10 h-10 text-white" />
          </motion.div>
          Help & Contacts
        </h1>
        <p className="text-gray-500 ml-1">Emergency numbers and verified service providers</p>
      </motion.div>

      {/* Emergency Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-500 via-red-600 to-orange-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity }}
          className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="p-3 bg-white/20 rounded-2xl">
            <AlertTriangle className="w-8 h-8" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-extrabold">Emergency? Call immediately!</h2>
            <p className="text-red-100 text-sm">Police: 100 | Fire: 101 | Ambulance: 102 | Security: 9876543200</p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Contacts */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
          Emergency Contacts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY.map((c, i) => (
            <motion.a key={c.name} href={`tel:${c.number}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${c.color} rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all`}>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/20 rounded-2xl mb-3">
                  <c.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold mb-1">{c.name}</h3>
                <p className="text-white/70 text-xs mb-2">{c.desc}</p>
                <p className="text-2xl font-extrabold">{c.number}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search services (plumber, electrician, doctor...)"
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base" />
      </div>

      {/* Service Contacts */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl"><Wrench className="w-6 h-6 text-blue-600" /></div>
          Service Providers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-100 group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.color} flex-shrink-0 shadow-lg`}>
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-gray-900 truncate">{c.name}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">{c.tag}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{c.person}</p>
                  <p className="text-xs text-green-600 font-semibold mb-3">{c.service}</p>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${c.number}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm">
                      <Phone className="w-4 h-4" />{c.number}
                    </a>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => copyNumber(c.number)}
                      className="p-1.5 bg-gray-100 hover:bg-green-100 rounded-lg transition-colors ml-auto">
                      {copied === c.number
                        ? <CheckCircle className="w-4 h-4 text-green-600" />
                        : <Copy className="w-4 h-4 text-gray-500" />}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Society Admin */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Society Admin Office</h3>
            <p className="text-blue-100 text-sm">Greenwood Heights Co-operative Housing Society</p>
            <p className="text-blue-200 text-xs mt-1">Plot No. 14, Sector 7, Kharghar, Navi Mumbai - 410210</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="tel:9076195126" className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition-colors px-5 py-3 rounded-2xl font-bold">
              <Phone className="w-5 h-5" /> 90761 95126
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
