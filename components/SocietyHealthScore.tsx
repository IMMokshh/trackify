"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Activity } from "lucide-react";

interface HealthScoreProps {
  score: number;
  trend: number;
  breakdown: {
    issueResolution: number;
    paymentCollection: number;
    sosResponseTime: number;
  };
}

export default function SocietyHealthScore({ score, trend, breakdown }: HealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke1: "#4ade80", stroke2: "#16a34a", text: "text-green-600", bg: "bg-green-50", gradient: "from-green-400 to-green-600" };
    if (score >= 60) return { stroke1: "#fbbf24", stroke2: "#d97706", text: "text-amber-600", bg: "bg-amber-50", gradient: "from-amber-400 to-amber-600" };
    return { stroke1: "#f87171", stroke2: "#dc2626", text: "text-red-600", bg: "bg-red-50", gradient: "from-red-400 to-red-600" };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Thriving";
    if (score >= 60) return "Needs Attention";
    return "Critical";
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Society Health Score</h2>
          <p className="text-gray-600 text-sm">Real-time performance metrics</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg}`}>
          {trend >= 0 ? (
            <TrendingUp className={`w-5 h-5 ${colors.text}`} />
          ) : (
            <TrendingDown className={`w-5 h-5 ${colors.text}`} />
          )}
          <span className={`font-semibold ${colors.text}`}>
            {trend >= 0 ? "+" : ""}{trend} pts
          </span>
        </div>      </div>

      <div className="flex items-center gap-8">
        {/* Circular Gauge */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.stroke1} />
                <stop offset="100%" stopColor={colors.stroke2} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className={`text-5xl font-black bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}>
                {score}
              </div>
              <div className={`text-sm font-semibold ${colors.text} mt-1`}>
                {getScoreLabel(score)}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-4">
          <ScoreBreakdownItem
            label="Issue Resolution"
            value={breakdown.issueResolution}
            weight={50}
            icon={CheckCircle}
          />
          <ScoreBreakdownItem
            label="Payment Collection"
            value={breakdown.paymentCollection}
            weight={35}
            icon={Activity}
          />
          <ScoreBreakdownItem
            label="SOS Response Time"
            value={breakdown.sosResponseTime}
            weight={15}
            icon={AlertCircle}
          />
        </div>
      </div>
    </div>
  );
}

function ScoreBreakdownItem({
  label,
  value,
  weight,
  icon: Icon,
}: {
  label: string;
  value: number;
  weight: number;
  icon: any;
}) {
  const getColor = (val: number) => {
    if (val >= 80) return "bg-green-500";
    if (val >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-400">· {weight}% weight</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
