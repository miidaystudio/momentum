import React, { useEffect } from "react";
import { AlertCircle, X, CheckCircle2 } from "lucide-react";

export default function ToastNotification({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-6 z-50 max-w-md w-full animate-slideInRight">
      <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/40 bg-black/90 backdrop-blur-xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center space-x-3 pr-2">
          {type === "error" ? (
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-light tracking-wide text-white/90 leading-relaxed">
            {message}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-white/50 hover:text-amber-400 hover:bg-white/10 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
