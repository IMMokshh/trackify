"use client";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let addToast: (message: string, type: ToastType) => void = () => {};

function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    addToast = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
  }, []);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ICONS = { success: CheckCircle, error: XCircle, info: AlertCircle };
  const COLORS = {
    success: "bg-green-50 border-green-200 text-green-800",
    error:   "bg-red-50 border-red-200 text-red-800",
    info:    "bg-blue-50 border-blue-200 text-blue-800",
  };
  const ICON_COLORS = { success: "text-green-500", error: "text-red-500", info: "text-blue-500" };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-200 ${COLORS[t.type]}`}>
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ICON_COLORS[t.type]}`} />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Mount once on first call
let mounted = false;
function ensureMounted() {
  if (mounted || typeof document === "undefined") return;
  mounted = true;
  const el = document.createElement("div");
  document.body.appendChild(el);
  createRoot(el).render(<ToastContainer />);
}

export const toast = {
  success: (msg: string) => { ensureMounted(); addToast(msg, "success"); },
  error:   (msg: string) => { ensureMounted(); addToast(msg, "error"); },
  info:    (msg: string) => { ensureMounted(); addToast(msg, "info"); },
};
