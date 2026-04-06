"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

interface TimelineStep {
  status: "open" | "in_progress" | "resolved" | "closed";
  label: string;
  timestamp?: string;
  active: boolean;
  completed: boolean;
}

interface IssueStatusTimelineProps {
  currentStatus: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt?: string;
}

export default function IssueStatusTimeline({ currentStatus, createdAt, updatedAt }: IssueStatusTimelineProps) {
  const statusOrder = ["open", "in_progress", "resolved", "closed"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const steps: TimelineStep[] = [
    {
      status: "open",
      label: "Reported",
      timestamp: createdAt,
      active: currentStatus === "open",
      completed: currentIndex >= 0,
    },
    {
      status: "in_progress",
      label: "In Progress",
      timestamp: currentStatus !== "open" ? updatedAt : undefined,
      active: currentStatus === "in_progress",
      completed: currentIndex >= 1,
    },
    {
      status: "resolved",
      label: "Resolved",
      timestamp: currentStatus === "resolved" || currentStatus === "closed" ? updatedAt : undefined,
      active: currentStatus === "resolved",
      completed: currentIndex >= 2,
    },
    {
      status: "closed",
      label: "Closed",
      timestamp: currentStatus === "closed" ? updatedAt : undefined,
      active: currentStatus === "closed",
      completed: currentIndex >= 3,
    },
  ];

  const getIcon = (step: TimelineStep) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-white" />;
    }
    if (step.active) {
      return <Clock className="w-6 h-6 text-white animate-pulse" />;
    }
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getColor = (step: TimelineStep) => {
    if (step.completed) return "bg-green-500";
    if (step.active) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10" />
        <motion.div
          className="absolute top-6 left-0 h-1 bg-green-500 -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className={`w-12 h-12 rounded-full ${getColor(step)} flex items-center justify-center shadow-lg mb-3 relative z-10`}
            >
              {getIcon(step)}
            </motion.div>
            <p className={`text-sm font-semibold ${step.completed || step.active ? "text-gray-900" : "text-gray-400"}`}>
              {step.label}
            </p>
            {step.timestamp && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(step.timestamp).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
