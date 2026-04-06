"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { buttonPress } from "@/lib/animations";
import { LoadingSpinner } from "../LoadingSpinner";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-200",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClasses = "rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      {...(disabled || loading ? {} : buttonPress)}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" color="text-white" />}
      {children}
    </motion.button>
  );
}
