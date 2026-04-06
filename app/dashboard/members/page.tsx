"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AvatarInitials from "@/components/ui/AvatarInitials";
import {
  Users, Search, Filter, User, Phone, Home, Car,
  PawPrint, X, Crown, Shield, Star, Mail, Building2,
  BadgeCheck, Hash, ChevronRight, ShieldCheck,
} from "lucide-react";
import { toast } from "@/lib/toast";

const WING_COLORS: Record<string, string> = {
  A: "from-violet-500 to-purple-600",
  B: "from-blue-500 to-cyan-600",
  C: "from-emerald-500 to-teal-600",
  D: "from-orange-500 to-red-500",
};

const WING_BG: Record<string, string> = {
  A: "bg-violet-50 border-violet-200",
  B: "bg-blue-50 border-blue-200",
  C: "bg-emerald-50 border-emerald-200",
  D: "bg-orange-50 border-orange-200",
};

const WING_TEXT: Record<string, string> = {
  A: "text-violet-700",
  B: "text-blue-700",
  C: "text-emerald-700",
  D: "text-orange-700",
};

const ROLE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string; gradient?: string; animClass?: string; cardClass?: string }> = {
  Chairman:   { icon: Crown,      color: "text-yellow-900",  bg: "bg-yellow-100",  label: "Chairwoman",  gradient: "from-yellow-400 via-amber-400 to-orange-400", animClass: "badge-authority-gold",   cardClass: "member-card member-card-gold"   },
  Chairwoman: { icon: Crown,      color: "text-yellow-900",  bg: "bg-yellow-100",  label: "Chairwoman",  gradient: "from-yellow-400 via-amber-400 to-orange-400", animClass: "badge-authority-gold",   cardClass: "member-card member-card-gold"   },
  Secretary:  { icon: Shield,     color: "text-indigo-700",  bg: "bg-indigo-100",  label: "Secretary",   gradient: "from-indigo-500 via-indigo-400 to-violet-500", animClass: "badge-authority-indigo", cardClass: "member-card member-card-indigo" },
  Treasurer:  { icon: Star,       color: "text-blue-700",    bg: "bg-blue-100",    label: "Treasurer",   gradient: "from-blue-500 via-blue-400 to-cyan-500",       animClass: "badge-authority-indigo", cardClass: "member-card member-card-indigo" },
  Committee:  { icon: BadgeCheck, color: "text-rose-700",    bg: "bg-rose-100",    label: "Committee",   gradient: "from-rose-500 via-pink-400 to-rose-400",       animClass: "badge-authority-rose",   cardClass: "member-card member-card-rose"   },
  Guard:      { icon: ShieldCheck,color: "text-slate-700",   bg: "bg-slate-100",   label: "Guard",       cardClass: "member-card" },
  Resident:   { icon: User,       color: "text-green-700",   bg: "bg-green-100",   label: "Resident",    animClass: "badge-resident",                              cardClass: "member-card member-card-green" },
};

function getInitials(name: string) {
  return name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function getWing(flat: string) {
  return flat?.charAt(0) || "A";
}

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWing, setFilterWing] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    full_name: "", email: "", phone: "", flat_number: "",
    family_members: "1", badge: "Resident", has_parking: false,
    parking_slot: "", has_pets: false, pets_count: "0",
  });

  useEffect(() => { fetchMembers(); }, []);
  useEffect(() => { filterMembers(); }, [searchTerm, filterWing, filterFloor, members]);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("society_members").select("*").order("flat_number", { ascending: true });
    if (!error && data) {
      const order: any = { Chairwoman: 1, Chairman: 1, Secretary: 2, Treasurer: 3, Committee: 4, Guard: 5, Resident: 6 };
      const sorted = data.sort((a, b) => {
        const diff = (order[a.badge] || 4) - (order[b.badge] || 4);
        return diff !== 0 ? diff : (a.flat_number || "").localeCompare(b.flat_number || "");
      });
      setMembers(sorted);
      setFilteredMembers(sorted);
    }
    setLoading(false);
  };

  const filterMembers = () => {
    let f = [...members];
    if (searchTerm) f = f.filter((m) =>
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.flat_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterWing !== "all") f = f.filter((m) => m.flat_number?.startsWith(filterWing));
    if (filterFloor !== "all") f = f.filter((m) => {
      const digits = (m.flat_number as string)?.replace(/^[A-D]-/, "");
      return parseInt(digits?.slice(0, -2)) === parseInt(filterFloor);
    });
    setFilteredMembers(f);
  };

  const addMember = async () => {
    if (!newMember.full_name || !newMember.flat_number) { toast.error("Name and flat number are required"); return; }
    setAddLoading(true);
    try {
      await supabase.from("society_members").insert({
        full_name: newMember.full_name, email: newMember.email, phone: newMember.phone,
        flat_number: newMember.flat_number, family_members: parseInt(newMember.family_members) || 1,
        badge: newMember.badge, has_parking: newMember.has_parking,
        parking_slot: newMember.parking_slot || null, has_pets: newMember.has_pets,
        pets_count: parseInt(newMember.pets_count) || 0,
      });
      setShowAddModal(false);
      setNewMember({ full_name: "", email: "", phone: "", flat_number: "", family_members: "1", badge: "Resident", has_parking: false, parking_slot: "", has_pets: false, pets_count: "0" });
      fetchMembers();
    } catch (err: any) { toast.error("Error: " + err.message); }
    finally { setAddLoading(false); }
  };

  const committeeCount = members.filter((m) => m.badge !== "Resident").length;
  const parkingCount = members.filter((m) => m.has_parking).length;
  const petsCount = members.filter((m) => m.has_pets).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Users className="w-10 h-10 text-indigo-500" />
            </motion.div>
            Society Members
          </h1>
          <p className="text-gray-500 mt-1">Greenwood Heights - 120 Residential Units</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
          + Add Member
        </motion.button>
      </motion.div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: members.length, color: "bg-indigo-500", icon: Users },
          { label: "Committee", value: committeeCount, color: "bg-amber-500", icon: Crown },
          { label: "Parking Slots", value: parkingCount, color: "bg-purple-500", icon: Car },
          { label: "Pet Owners", value: petsCount, color: "bg-orange-500", icon: PawPrint },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`${s.color} p-2.5 rounded-xl`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, flat, email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={filterWing} onChange={(e) => setFilterWing(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none bg-white">
              <option value="all">All Wings</option>
              {["A","B","C","D"].map((w) => <option key={w} value={w}>Wing {w}</option>)}
            </select>
          </div>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={filterFloor} onChange={(e) => setFilterFloor(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none bg-white">
              <option value="all">All Floors</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((f) => <option key={f} value={String(f)}>Floor {f}</option>)}
            </select>
          </div>
        </div>
        {filteredMembers.length !== members.length && (
          <p className="text-xs text-indigo-500 mt-3 font-medium">Showing {filteredMembers.length} of {members.length} members</p>
        )}
      </motion.div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Users className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No members found</p>
          </div>
        ) : (
          filteredMembers.map((member, index) => {
            const wing = getWing(member.flat_number);
            const role = ROLE_CONFIG[member.badge] || ROLE_CONFIG.Resident;
            const RoleIcon = role.icon;
            return (
              <motion.div key={member.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={() => setSelectedMember(member)}
                className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer group transition-all ${role.cardClass || "member-card"}`}>
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <AvatarInitials name={member.full_name} size="lg" className="flex-shrink-0 shadow-md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{member.full_name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${WING_BG[wing]} ${WING_TEXT[wing]}`}>
                        {member.flat_number}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 ${role.gradient ? `bg-gradient-to-r ${role.gradient} text-white shadow ${role.animClass || ""}` : `${role.bg} ${role.color} ${role.animClass || ""}`}`}>
                        <RoleIcon className="w-3 h-3" />
                        {role.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {member.has_parking && <span className="text-xs text-gray-400 flex items-center gap-1"><Car className="w-3 h-3" />Parking</span>}
                      {member.has_pets && <span className="text-xs text-gray-400 flex items-center gap-1"><PawPrint className="w-3 h-3" />Pets</span>}
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{member.family_members || 1} members</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}>
            <motion.div initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

              {/* Modal Header Banner */}
              {(() => {
                const wing = getWing(selectedMember.flat_number);
                const role = ROLE_CONFIG[selectedMember.badge] || ROLE_CONFIG.Resident;
                const RoleIcon = role.icon;
                return (
                  <>
                    <div className={`bg-gradient-to-br ${WING_COLORS[wing] || WING_COLORS.A} p-6 relative`}>
                      <button onClick={() => setSelectedMember(null)}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="flex items-center gap-4">
                        <AvatarInitials name={selectedMember.full_name} size="xl" className="shadow-lg" />
                        <div>
                          <h2 className="text-2xl font-black text-white">{selectedMember.full_name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-white/20 text-white text-sm font-bold px-3 py-0.5 rounded-lg flex items-center gap-1">
                              <Home className="w-3.5 h-3.5" /> Flat {selectedMember.flat_number}
                            </span>
                            {role.gradient ? (
                              <span className={`bg-gradient-to-r ${role.gradient} text-white text-sm font-black px-3 py-0.5 rounded-lg flex items-center gap-1 shadow-lg ${role.animClass || ""}`}>
                                <RoleIcon className="w-3.5 h-3.5" /> {role.label}
                              </span>
                            ) : (
                              <span className={`bg-white/20 text-white text-sm font-bold px-3 py-0.5 rounded-lg flex items-center gap-1 ${role.animClass || ""}`}>
                                <RoleIcon className="w-3.5 h-3.5" /> {role.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                      {/* Contact */}
                      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedMember.email || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedMember.phone || "Not provided"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 rounded-2xl p-3 text-center">
                          <p className="text-2xl font-black text-blue-600">{selectedMember.family_members || 1}</p>
                          <p className="text-xs text-blue-500 font-medium mt-0.5">Family Members</p>
                        </div>
                        <div className={`${selectedMember.has_parking ? "bg-purple-50" : "bg-gray-50"} rounded-2xl p-3 text-center`}>
                          <Car className={`w-6 h-6 mx-auto ${selectedMember.has_parking ? "text-purple-500" : "text-gray-300"}`} />
                          <p className={`text-xs font-medium mt-1 ${selectedMember.has_parking ? "text-purple-500" : "text-gray-400"}`}>
                            {selectedMember.has_parking ? selectedMember.parking_slot || "Parking" : "No Parking"}
                          </p>
                        </div>
                        <div className={`${selectedMember.has_pets ? "bg-orange-50" : "bg-gray-50"} rounded-2xl p-3 text-center`}>
                          <PawPrint className={`w-6 h-6 mx-auto ${selectedMember.has_pets ? "text-orange-500" : "text-gray-300"}`} />
                          <p className={`text-xs font-medium mt-1 ${selectedMember.has_pets ? "text-orange-500" : "text-gray-400"}`}>
                            {selectedMember.has_pets ? `${selectedMember.pets_count} Pet(s)` : "No Pets"}
                          </p>
                        </div>
                      </div>

                      {/* Wing info */}
                      <div className={`rounded-2xl p-4 border ${WING_BG[wing]}`}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wing Info</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-lg font-black ${WING_TEXT[wing]}`}>Wing {wing}</p>
                            <p className="text-xs text-gray-500">Greenwood Heights</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-br ${WING_COLORS[wing]} rounded-xl flex items-center justify-center shadow`}>
                            <span className="text-white font-black text-xl">{wing}</span>
                          </div>
                        </div>
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMember(null)}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm">
                        Close
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Member</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name *", key: "full_name", type: "text", placeholder: "John Doe" },
                  { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Flat Number *", key: "flat_number", type: "text", placeholder: "A-101" },
                  { label: "Family Members", key: "family_members", type: "number", placeholder: "1" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
                    <input type={f.type} value={(newMember as any)[f.key]}
                      onChange={(e) => setNewMember({ ...newMember, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                  <select value={newMember.badge} onChange={(e) => setNewMember({ ...newMember, badge: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    {["Resident","Committee","Treasurer","Secretary"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  {[{ key: "has_parking", label: "Has Parking" }, { key: "has_pets", label: "Has Pets" }].map((c) => (
                    <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={(newMember as any)[c.key]}
                        onChange={(e) => setNewMember({ ...newMember, [c.key]: e.target.checked })} className="w-4 h-4 accent-indigo-500" />
                      <span className="text-sm text-gray-700">{c.label}</span>
                    </label>
                  ))}
                </div>
                {newMember.has_parking && (
                  <input value={newMember.parking_slot} onChange={(e) => setNewMember({ ...newMember, parking_slot: e.target.value })}
                    placeholder="Parking slot (e.g. P-12)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                )}
                {newMember.has_pets && (
                  <input type="number" value={newMember.pets_count} onChange={(e) => setNewMember({ ...newMember, pets_count: e.target.value })}
                    placeholder="Number of pets"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={addMember} disabled={addLoading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                  {addLoading ? "Adding..." : "Add Member"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">
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
