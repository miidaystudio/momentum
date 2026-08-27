import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#08070b]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo Left */}
        <a href="#" className="flex flex-col text-left group">
          <span className="text-lg md:text-xl font-black tracking-[0.3em] uppercase text-white group-hover:text-amber-400 transition-colors font-hero-heading">
            MOMENTUM
          </span>
          <span className="text-[9px] font-semibold tracking-[0.45em] uppercase text-white/50">
            DISCOVERY & EXPEDITIONS
          </span>
        </a>

        {/* Center / Right Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { label: "About", href: "#value-strip" },
            { label: "Destinations", href: "#destinations" },
            { label: "Journal", href: "#journal" },
            { label: "Contact", href: "#footer" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors duration-300 group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-white hover:text-amber-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#08070b]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col space-y-6 animate-fadeIn">
          {[
            { label: "About", href: "#value-strip" },
            { label: "Destinations", href: "#destinations" },
            { label: "Journal", href: "#journal" },
            { label: "Contact", href: "#footer" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="text-sm font-bold uppercase tracking-[0.25em] text-white/80 hover:text-amber-400 transition-colors border-b border-white/5 pb-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
