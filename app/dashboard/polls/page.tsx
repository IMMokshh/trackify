"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { BarChart3, Plus, X, Vote, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";

export default function PollsPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""], anonymous: false, expires_at: "" });
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => { fetchProfile(); fetchPolls(); }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
  };

  const fetchPolls = async () => {
    const { data } = await supabase.from("polls").select(`*, poll_votes(*)`).order("created_at", { ascending: false });
    setPolls(data || []);
    setLoading(false);
  };

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.filter(o => o.trim()).length < 2) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("polls").insert({
      question: newPoll.question,
      options: newPoll.options.filter(o => o.trim()),
      anonymous: newPoll.anonymous,
      expires_at: newPoll.expires_at || null,
      created_by: user.id,
    });
    setShowCreateModal(false);
    setNewPoll({ question: "", options: ["", ""], anonymous: false, expires_at: "" });
    fetchPolls();
  };

  const vote = async (pollId: string, option: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const poll = polls.find(p => p.id === pollId);
    const hasVoted = poll?.poll_votes?.some((v: any) => v.user_id === user.id);
    if (hasVoted) await supabase.from("poll_votes").delete().eq("poll_id", pollId).eq("user_id", user.id);
    await supabase.from("poll_votes").insert({ poll_id: pollId, user_id: user.id, option });
    fetchPolls();
  };

  const totalVotesAll = polls.reduce((acc, p) => acc + (p.poll_votes?.length || 0), 0);

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-xl">
              <Vote className="w-10 h-10 text-white" />
            </motion.div>
            Polls & Voting
          </h1>
          <p className="text-gray-500 ml-1">Democratic decision making for the society</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:shadow-indigo-500/40 transition-all">
          <Plus className="w-5 h-5" /> Create Poll
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Polls", value: polls.length, color: "from-indigo-500 to-purple-600" },
          { label: "Total Votes", value: totalVotesAll, color: "from-blue-500 to-cyan-600" },
          { label: "Active", value: polls.filter(p => !p.expires_at || new Date(p.expires_at) > new Date()).length, color: "from-green-500 to-emerald-600" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-xl`}>
            <p className="text-white/70 text-xs font-semibold mb-1">{s.label}</p>
            <p className="text-4xl font-extrabold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Polls */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <Vote className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-400">Create the first poll for your society!</p>
          </div>
        ) : (
          polls.map((poll, index) => {
            const totalVotes = poll.poll_votes?.length || 0;
            const userVote = poll.poll_votes?.find((v: any) => v.user_id === profile?.id);
            const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
            const voteCounts = poll.options.reduce((acc: any, opt: string) => {
              acc[opt] = poll.poll_votes?.filter((v: any) => v.option === opt).length || 0;
              return acc;
            }, {});
            const winningOption = poll.options.reduce((a: string, b: string) => voteCounts[a] >= voteCounts[b] ? a : b, poll.options[0]);

            return (
              <motion.div key={poll.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{poll.question}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isExpired ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">Closed</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                      </span>
                    )}
                    {poll.anonymous && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Anonymous</span>}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {poll.options.map((option: string) => {
                    const votes = voteCounts[option];
                    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                    const isSelected = userVote?.option === option;
                    const isWinning = totalVotes > 0 && option === winningOption;

                    return (
                      <motion.button key={option} whileHover={{ scale: isExpired ? 1 : 1.01 }} whileTap={{ scale: isExpired ? 1 : 0.99 }}
                        onClick={() => !isExpired && vote(poll.id, option)}
                        disabled={isExpired}
                        className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                          isSelected ? "bg-indigo-50 border-indigo-400 shadow-md" :
                          "bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                        } ${isExpired ? "cursor-default" : "cursor-pointer"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                            <span className="font-bold text-gray-900">{option}</span>
                            {isWinning && totalVotes > 0 && <span className="text-xs font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Leading</span>}
                          </div>
                          <span className="text-sm font-extrabold text-indigo-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-2.5 rounded-full ${isSelected ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-gradient-to-r from-gray-400 to-gray-500"}`} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {votes} vote{votes !== 1 ? "s" : ""}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" />{totalVotes} total votes</span>
                  {poll.expires_at && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {isExpired ? "Ended" : "Ends"}: {new Date(poll.expires_at).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl"><Vote className="w-6 h-6 text-indigo-600" /></div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Create Poll</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
                  <input type="text" value={newPoll.question} onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                    placeholder="What would you like to ask the society?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Options *</label>
                  {newPoll.options.map((opt, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={opt} onChange={(e) => {
                        const opts = [...newPoll.options]; opts[i] = e.target.value;
                        setNewPoll({ ...newPoll, options: opts });
                      }} placeholder={`Option ${i + 1}`}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                      {newPoll.options.length > 2 && (
                        <button onClick={() => setNewPoll({ ...newPoll, options: newPoll.options.filter((_, j) => j !== i) })}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><X className="w-5 h-5" /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                    className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 mt-1">+ Add Option</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newPoll.anonymous} onChange={(e) => setNewPoll({ ...newPoll, anonymous: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 rounded" />
                    <span className="text-sm font-semibold text-gray-700">Anonymous</span>
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                    <input type="date" value={newPoll.expires_at} onChange={(e) => setNewPoll({ ...newPoll, expires_at: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createPoll}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg">
                    Create Poll
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
