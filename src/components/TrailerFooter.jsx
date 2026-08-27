import React, { useState } from "react";
import { Send, Globe, ArrowRight, Share2, Compass, Tv, Film } from "lucide-react";

export default function TrailerFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="relative w-full bg-[#050507] text-white border-t border-white/10">
      {/* ---------------- Footer Section ---------------- */}
      <footer id="footer" className="relative w-full py-16 px-6 sm:px-12 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
            
            {/* Brand & Newsletter Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-xl font-black tracking-[0.3em] uppercase text-white font-hero-heading">
                  MOMENTUM
                </span>
                <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-white/40 mb-6">
                  DISCOVERY SOCIETY
                </p>
                <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed max-w-md mb-8">
                  Subscribe to our private dispatch newsletter to receive unreleased 4K stills, expedition log entry updates, and film screening passes.
                </p>
              </div>

              {/* Newsletter Input */}
              {isSubscribed ? (
                <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  ✓ DISPATCH SUBSCRIPTION CONFIRMED. WELCOME TO THE EXPEDITION.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 pr-16 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Submit newsletter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black transition-transform duration-300 hover:scale-110 hover:bg-amber-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-4">
                EXPLORE
              </h4>
              {["Destinations", "Journal", "Filmmakers", "Screenings", "Press Kit"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-amber-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social Icons & Tilting Micro-Interactions */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-4">
                  CONNECT
                </h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Globe, label: "Official Web", href: "#" },
                    { icon: Film, label: "Vimeo Channel", href: "#" },
                    { icon: Tv, label: "Broadcasting", href: "#" },
                    { icon: Share2, label: "Social Media", href: "#" },
                  ].map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.href}
                        aria-label={social.label}
                        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-amber-400 hover:bg-amber-400/20 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                      >
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 text-right">
                <span className="text-[10px] font-mono text-white/40 block">
                  LOCATION: 64° 08' N, 21° 56' W
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Legal Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 text-[10px] font-mono text-white/40">
            <p>© 2026 MOMENTUM EXPEDITION MEDIA GROUP. ALL RIGHTS RESERVED. • BUILT BY MIIDAYSTUDIO</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-amber-400 transition-colors">
                PRIVACY POLICY
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                TERMS OF SERVICE
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                PRESS CONTACT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
