import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function TrailerModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0c0d10] p-2 sm:p-4 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:border-amber-400 hover:text-amber-400 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Video Embed Container (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
          <iframe
            className="h-full w-full object-cover"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1"
            title="Expedition Documentary Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-4 pb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
              OFFICIAL DOCUMENTARY TRAILER (4K UHD)
            </span>
            <h3 className="text-lg font-black uppercase text-white tracking-wide">
              MOMENTUM: BEYOND THE HORIZON
            </h3>
          </div>
          <div className="flex items-center space-x-6 text-xs text-white/60 font-mono">
            <span>RUNTIME: 02:45</span>
            <span>DIRECTED BY: ALEXIS VANE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
