import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, MapPin, ArrowRight, Sparkles, Compass, ArrowDown, Globe } from "lucide-react";
import { PRESETS } from "../services/openTripMap";

gsap.registerPlugin(ScrollTrigger);

const LANDSCAPE_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2560&auto=format&fit=crop",
];

export default function SearchHero({
  currentRegion,
  onSearch,
  isLoading,
}) {
  const containerRef = useRef(null);
  const bgImageRef = useRef(null);
  const searchBtnRef = useRef(null);

  // Load timeline element refs
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const searchContainerRef = useRef(null);
  const tagsRef = useRef(null);
  const periodDotRef = useRef(null);
  const badgeRef = useRef(null);
  const rightScrollRef = useRef(null);

  const [query, setQuery] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Background cross-dissolve loop every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % LANDSCAPE_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Master GSAP Load Sequence & Parallax Drift
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Eyebrow label (0.2s - 0.5s)
      tl.fromTo(
        eyebrowRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.2
      );

      // 2. Headline words stagger (0.4s - 1.0s)
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".headline-word");
        tl.fromTo(
          words,
          { y: 45, opacity: 0, rotateX: 20 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.12, duration: 0.9 },
          0.4
        );
      }

      // 3. Subtext fade (0.9s - 1.2s)
      tl.fromTo(
        subtextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.9
      );

      // 4. Search bar slide-up (1.1s - 1.4s)
      tl.fromTo(
        searchContainerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.1
      );

      // 5. Popular tags stagger left-to-right (1.3s - 1.7s)
      if (tagsRef.current) {
        const tagButtons = tagsRef.current.querySelectorAll(".tag-pill");
        tl.fromTo(
          tagButtons,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
          1.3
        );
      }

      // 6. Right side telemetry badge & scroll rail (1.4s)
      tl.fromTo(
        badgeRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        1.4
      );

      tl.fromTo(
        rightScrollRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        1.5
      );

      // 7. Pulse glow on amber period dot after completion
      if (periodDotRef.current) {
        gsap.to(periodDotRef.current, {
          scale: 1.4,
          opacity: 0.7,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: "sine.inOut",
          delay: 2.0,
        });
      }

      // Slow Parallax drift on background image during vertical scroll
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length >= 2) {
      const filtered = PRESETS.filter(
        (p) =>
          p.name.toLowerCase().includes(val.toLowerCase()) ||
          p.query.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (suggestQuery) => {
    setQuery(suggestQuery);
    onSearch(suggestQuery);
    setShowDropdown(false);
  };

  // Magnetic search button hover physics
  const handleMagneticMove = (e) => {
    if (!searchBtnRef.current) return;
    const rect = searchBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(searchBtnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    if (!searchBtnRef.current) return;
    gsap.to(searchBtnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#08070b] text-white select-none antialiased flex flex-col justify-between pt-32 pb-16 px-6 md:px-16"
    >
      {/* FULL-SCREEN Background Luminous Landscape Images with Ken Burns Zoom & Directional Gradient */}
      <div ref={bgImageRef} className="absolute inset-0 w-full h-full z-0 will-change-transform overflow-hidden">
        {LANDSCAPE_IMAGES.map((img, i) => (
          <img
            key={img}
            src={img}
            alt="Expedition Fullscreen Landscape"
            className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none animate-kenburns transition-opacity duration-1000 ${
              bgIndex === i ? "opacity-80" : "opacity-0"
            }`}
          />
        ))}
        {/* Asymmetrical Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.035] bg-grain pointer-events-none mix-blend-screen" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex h-full flex-col justify-between my-auto w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block & Search (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            
            {/* Eyebrow Label */}
            <div ref={eyebrowRef} className="flex items-center space-x-3 text-amber-400">
              <Compass className="h-4 w-4 animate-spin-slow" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em]">
                THE GLOBAL DISCOVERY PORTAL
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} className="overflow-hidden">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black uppercase tracking-tight leading-[0.92] text-white font-hero-heading drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
                <span className="headline-word inline-block mr-2.5">FIND</span>
                <span className="headline-word inline-block mr-2.5">YOUR</span>
                <span className="headline-word inline-block mr-2.5">NEXT</span>
                <br />
                <span className="headline-word inline-block text-amber-400">ADVENTURE</span>
                <span ref={periodDotRef} className="headline-word inline-block text-amber-500 ml-0.5">
                  .
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p
              ref={subtextRef}
              className="max-w-xl text-xs sm:text-sm font-light leading-relaxed text-white/80 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
              Uncover remote alpine passes, ocean abysses, and solar salars powered by live OpenTripMap telemetry.
            </p>

            {/* Elevated Visual Anchor Search Bar */}
            <div ref={searchContainerRef} className="relative max-w-xl pt-1">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-4 h-4 w-4 text-amber-400 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                    placeholder="Where do you want to explore?"
                    className="w-full rounded-full border border-white/20 bg-black/70 px-12 py-3.5 text-xs text-white placeholder-white/40 backdrop-blur-2xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                  />
                </div>

                {/* Magnetic Search Button */}
                <button
                  ref={searchBtnRef}
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="magnetic-btn ml-3 flex items-center space-x-2 rounded-full bg-amber-400 px-5 sm:px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(245,158,11,0.4)] shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl border border-white/15 bg-black/95 backdrop-blur-2xl p-2 shadow-2xl z-40">
                  {suggestions.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleSelectSuggestion(item.query)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase">{item.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-amber-400/80">{item.tag}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Tag Pills Staggered Row */}
              <div ref={tagsRef} className="flex flex-wrap items-center gap-2.5 mt-6">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 mr-1 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>POPULAR:</span>
                </span>
                {PRESETS.map((preset) => {
                  const isActive =
                    currentRegion?.toLowerCase() === preset.query.toLowerCase() ||
                    currentRegion?.toLowerCase() === preset.name.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectSuggestion(preset.query)}
                      className={`tag-pill rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-all border ${
                        isActive
                          ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] font-black"
                          : "bg-white/5 border-white/15 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Telemetry Badge & Scroll Cue (4 cols) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-between space-y-8">
            
            {/* Floating Telemetry Stat Badge */}
            <div
              ref={badgeRef}
              className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-6 shadow-2xl max-w-xs text-right border-r-4 border-r-amber-400"
            >
              <div className="flex items-center justify-end space-x-2 text-amber-400 mb-1">
                <Globe className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  LIVE TELEMETRY
                </span>
              </div>
              <span className="text-3xl font-black text-white font-mono block">
                12,000+
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/60 block mt-1">
                VERIFIED POI LOCATIONS
              </span>
            </div>

            {/* Vertical Scroll Rail Indicator */}
            <div
              ref={rightScrollRef}
              className="flex flex-col items-center space-y-4 pt-12 pr-6"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 rotate-90 origin-center whitespace-nowrap">
                SCROLL TO EXPLORE
              </span>
              <div className="relative h-20 w-[1px] bg-white/20 overflow-hidden mt-4">
                <div className="absolute top-0 left-0 h-8 w-full bg-gradient-to-b from-transparent via-amber-400 to-amber-500 animate-bounce" />
              </div>
              <div className="h-2 w-2 rounded-full border border-amber-400 bg-amber-400/50 animate-pulse" />
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Footer Telemetry Bar */}
      <footer className="relative z-20 flex items-center justify-between border-t border-white/10 pt-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-white/50">
          <span>ACTIVE REGION: {currentRegion ? currentRegion.toUpperCase() : "CHAMONIX"}</span>
        </div>

        <a
          href="#destinations"
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors"
        >
          <span>Scroll To Destinations</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </footer>

    </section>
  );
}
