import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Volume2, VolumeX, RotateCcw, MapPin, Compass, ChevronDown, Sparkles, RefreshCw } from "lucide-react";
import DestinationSelector from "./DestinationSelector";

gsap.registerPlugin(ScrollTrigger);

export default function CardStackHero({
  cardsData = [],
  regionInfo = null,
  isLoading = false,
  error = null,
  onSearchDestination,
  onRetry,
  onOpenTrailer,
}) {
  const pinSectionRef = useRef(null);
  const canvasRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // ----------------------------------------------------
  // 1. Particle Trail Canvas Effect
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.4 ? "#f59e0b" : "#ffffff",
      pulse: Math.random() * 0.03 + 0.005,
    }));

    const onPointerMove = (e) => {
      if (Math.random() < 0.6) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2.5 + 0.8,
          alpha: 0.8,
          color: Math.random() > 0.3 ? "#f59e0b" : "#6366f1",
          pulse: 0.05,
        });
        if (particles.length > 180) particles.shift();
      }
    };
    window.addEventListener("pointermove", onPointerMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.003;
        if (p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.alpha = Math.random() * 0.5 + 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f59e0b";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ----------------------------------------------------
  // 2. GSAP Viewport Pinning & 3D Card Scrubbing
  // ----------------------------------------------------
  useEffect(() => {
    if (isLoading || !cardsData || cardsData.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      // Set initial 3D stack positions
      cards.forEach((card, index) => {
        const depth = index * -35;
        const scale = 1 - index * 0.04;
        const rotateZ = (index % 2 === 0 ? 1 : -1) * (index * 2);
        const yOffset = index * 12;

        gsap.set(card, {
          transformPerspective: 1200,
          z: depth,
          scale: scale,
          rotateZ: rotateZ,
          y: yOffset,
          rotateX: 0,
          rotateY: 0,
          transformOrigin: "center center",
          opacity: 1,
          x: 0,
        });
      });

      const totalScrollFactor = cards.length * 1.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: "top top",
          end: `+=${totalScrollFactor * 100}%`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const prog = self.progress;
            const cardProgressStep = 1 / (cards.length - 1 || 1);
            const activeIdx = Math.min(
              cards.length - 1,
              Math.floor(prog * cards.length)
            );
            setActiveCardIndex(activeIdx);

            cards.forEach((card, index) => {
              const cardStart = index * cardProgressStep;
              const localProg = Math.max(
                0,
                Math.min(1, (prog - cardStart) / cardProgressStep)
              );

              if (index < activeIdx) {
                gsap.to(card, {
                  x: -window.innerWidth * 1.2,
                  y: -100,
                  rotateZ: -25,
                  rotateY: -35,
                  opacity: 0,
                  duration: 0.4,
                  overwrite: "auto",
                });
              } else if (index === activeIdx) {
                const slideX = localProg * -window.innerWidth * 1.1;
                const slideRot = localProg * -20;

                gsap.to(card, {
                  x: slideX,
                  y: 0,
                  z: 0,
                  scale: 1,
                  rotateZ: slideRot,
                  rotateY: localProg * -30,
                  opacity: 1 - localProg,
                  duration: 0.4,
                  overwrite: "auto",
                });
              } else {
                const relativePos = index - activeIdx;
                const targetZ = relativePos * -40;
                const targetScale = 1 - relativePos * 0.04;
                const targetZRot = (relativePos % 2 === 0 ? 1 : -1) * (relativePos * 2.5);

                gsap.to(card, {
                  x: 0,
                  y: relativePos * 14,
                  z: targetZ,
                  scale: targetScale,
                  rotateZ: targetZRot,
                  rotateY: 0,
                  opacity: 1,
                  duration: 0.5,
                  overwrite: "auto",
                });
              }
            });
          },
        },
      });
    }, pinSectionRef);

    return () => ctx.revert();
  }, [cardsData, isLoading]);

  const handleResetStack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentCard = cardsData[activeCardIndex] || cardsData[0];

  return (
    <section
      ref={pinSectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#08070b] text-white select-none antialiased"
    >
      {/* HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Atmospheric Vignette & Grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90 pointer-events-none z-10" />
      <div className="absolute inset-0 opacity-[0.035] bg-grain pointer-events-none z-10 mix-blend-screen" />

      {/* ---------------- Top Floating Navigation ---------------- */}
      <header className="relative z-30 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:px-16 border-b border-white/10 backdrop-blur-sm gap-4">
        {/* Brand */}
        <a href="#" className="flex flex-col text-left group shrink-0">
          <span className="text-base md:text-lg font-black tracking-[0.3em] uppercase text-white group-hover:text-amber-400 transition-colors font-hero-heading">
            MOMENTUM
          </span>
          <span className="text-[9px] font-semibold tracking-[0.45em] uppercase text-white/50">
            OPENTRIPMAP EXPEDITION DECK
          </span>
        </a>

        {/* Center Search Selector */}
        <div className="w-full max-w-xl">
          <DestinationSelector
            currentRegion={regionInfo?.regionName}
            onSearch={onSearchDestination}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </div>

        {/* Top Controls */}
        <div className="flex items-center space-x-4 shrink-0">
          <button
            onClick={handleResetStack}
            className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">RESET</span>
          </button>

          <button
            onClick={onOpenTrailer}
            className="flex items-center space-x-2 rounded-full bg-amber-400 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>TRAILER</span>
          </button>
        </div>
      </header>

      {/* ---------------- Main Deck Area ---------------- */}
      <div className="relative z-20 flex h-[calc(100vh-120px)] items-center justify-center p-4 md:p-8 overflow-hidden">
        
        {/* Left Side Progress Counter */}
        {cardsData.length > 0 && (
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-6 z-30">
            <div className="flex flex-col items-center space-y-1 font-mono">
              <span className="text-4xl font-black text-amber-400">
                {currentCard?.id || "01"}
              </span>
              <span className="text-xs text-white/40">/ {currentCard?.total || "05"}</span>
            </div>

            <div className="h-28 w-[2px] bg-white/15 relative">
              <div
                className="absolute top-0 left-0 w-full bg-amber-400 transition-all duration-300"
                style={{
                  height: `${((activeCardIndex + 1) / Math.max(1, cardsData.length)) * 100}%`,
                }}
              />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 rotate-90 origin-center whitespace-nowrap">
              {regionInfo?.regionName ? `${regionInfo.regionName.toUpperCase()} POIs` : "OPENTRIPMAP"}
            </span>
          </div>
        )}

        {/* Loading Shimmer State */}
        {isLoading ? (
          <div className="w-full max-w-4xl h-[520px] sm:h-[580px] rounded-3xl border border-white/10 bg-[#0e1015]/80 p-8 sm:p-12 backdrop-blur-md flex flex-col justify-between animate-pulse">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="h-4 w-32 bg-white/10 rounded-full" />
              <div className="h-4 w-24 bg-white/10 rounded-full" />
            </div>
            <div className="space-y-4 my-auto">
              <div className="h-4 w-40 bg-amber-400/20 rounded-full" />
              <div className="h-12 w-3/4 bg-white/15 rounded-xl" />
              <div className="h-4 w-full bg-white/10 rounded-full" />
              <div className="h-4 w-5/6 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="h-4 w-48 bg-white/10 rounded-full" />
              <div className="h-8 w-28 bg-amber-400/20 rounded-full" />
            </div>
          </div>
        ) : cardsData.length === 0 ? (
          /* Empty State */
          <div className="w-full max-w-xl p-8 rounded-3xl border border-white/10 bg-[#0e1015] text-center backdrop-blur-md">
            <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase text-white mb-2">
              NO ADVENTURES FOUND NEARBY
            </h3>
            <p className="text-xs text-white/60 mb-6">
              Try searching another global destination or select one of our curated preset regions above.
            </p>
          </div>
        ) : (
          /* 3D Stack Cards Container */
          <div
            ref={cardsContainerRef}
            data-cursor="pointer"
            className="relative w-full max-w-4xl h-[520px] sm:h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {cardsData.map((card, index) => (
              <div
                key={card.title + index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full rounded-3xl border border-white/15 bg-[#0e1015] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-shadow duration-500 will-change-transform"
                style={{
                  zIndex: cardsData.length - index,
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover object-center transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
                </div>

                {/* Card Foreground */}
                <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-12 text-white select-none">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300">
                        {card.tag}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-white/60">
                        {card.elevation}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] font-mono text-white/50">
                      <MapPin className="h-3 w-3 text-amber-400" />
                      <span>{card.temp}</span>
                    </div>
                  </div>

                  {/* Center Content */}
                  <div className="my-auto max-w-2xl">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-amber-400 mb-2 block">
                      {card.subtitle}
                    </span>

                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-hero-heading leading-[0.92] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-4">
                      {card.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-light text-white/80 leading-relaxed tracking-wide max-w-xl line-clamp-3 drop-shadow">
                      {card.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-wrap items-center justify-between border-t border-white/15 pt-6 gap-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-white/50">
                      <Compass className="h-4 w-4 text-amber-400" />
                      <span>{card.location}</span>
                    </div>

                    <button
                      onClick={onOpenTrailer}
                      className="group flex items-center space-x-3 rounded-full border border-white/30 bg-black/60 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md transition-all hover:border-amber-400 hover:bg-amber-400 hover:text-black"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Explore Film</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right Scroll Cue */}
        {cardsData.length > 0 && !isLoading && (
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-6 z-30">
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 rotate-90 origin-center whitespace-nowrap">
              SCROLL / SCRUB DECK
            </span>
            <div className="relative h-20 w-[1px] bg-white/20 overflow-hidden">
              <div className="absolute top-0 left-0 h-8 w-full bg-gradient-to-b from-transparent via-amber-400 to-amber-500 animate-bounce" />
            </div>
            <ChevronDown className="h-4 w-4 text-amber-400 animate-bounce" />
          </div>
        )}

      </div>
    </section>
  );
}
