import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MomentumHero({ onOpenTrailer }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);
  const headerRef = useRef(null);
  const titleLinesRef = useRef([]);
  const textElementsRef = useRef([]);
  const laurelsRef = useRef(null);
  const rightScrollRef = useRef(null);

  // Magnetic button refs
  const primaryBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);

  // ----------------------------------------------------
  // 1. Interactive Atmospheric Dust / Embers Canvas
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

    // Ambient floating dust particles
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.3,
      color: Math.random() > 0.4 ? "rgba(245, 158, 11, " : "rgba(255, 255, 255, ",
      alpha: Math.random() * 0.5 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.003;

        // Repulsion breeze from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 1.6;
          p.y += (dy / dist) * force * 1.6;
        }

        // Boundary wrap
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.05, Math.min(0.7, p.alpha))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(245, 158, 11, 0.5)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ----------------------------------------------------
  // 2. GSAP Entrance Timeline & Mouse Parallax
  // ----------------------------------------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        bgImageRef.current,
        { scale: 1.18, filter: "brightness(0) contrast(1.2)" },
        { scale: 1.05, filter: "brightness(0.65) contrast(1.1)", duration: 2.4, ease: "power3.inOut" }
      )
        .fromTo(
          headerRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=1.6"
        )
        .fromTo(
          titleLinesRef.current,
          { y: 80, opacity: 0, rotateX: 35, transformOrigin: "bottom left" },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.18, duration: 1.4 },
          "-=1.2"
        )
        .fromTo(
          textElementsRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 1 },
          "-=0.9"
        )
        .fromTo(
          laurelsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          rightScrollRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 1 },
          "-=1"
        );

      // Smooth mouse parallax on background
      const xSetBg = gsap.quickTo(bgImageRef.current, "x", { duration: 1.8, ease: "power3.out" });
      const ySetBg = gsap.quickTo(bgImageRef.current, "y", { duration: 1.8, ease: "power3.out" });

      const handleParallax = (e) => {
        const { innerWidth, innerHeight } = window;
        const xOffset = (e.clientX / innerWidth - 0.5) * 35;
        const yOffset = (e.clientY / innerHeight - 0.5) * 35;

        xSetBg(-xOffset);
        ySetBg(-yOffset);
      };

      window.addEventListener("mousemove", handleParallax);
      return () => window.removeEventListener("mousemove", handleParallax);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ----------------------------------------------------
  // 3. Magnetic Button Hover Interaction
  // ----------------------------------------------------
  const handleMagneticMove = (e, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = (ref) => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#080a0c] text-white font-sans select-none antialiased"
    >
      {/* ---------------- Background Layers ---------------- */}
      <img
        ref={bgImageRef}
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2560&auto=format&fit=crop"
        alt="Atmospheric Mountain Range"
        className="absolute inset-0 h-[115%] w-[115%] -left-[7.5%] -top-[7.5%] object-cover object-center pointer-events-none animate-kenburns will-change-transform"
      />

      {/* Cinematic Vignette & Color Grading Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c] via-transparent to-black/80 pointer-events-none" />
      
      {/* Film Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-screen bg-grain" />

      {/* Atmospheric Canvas for Embers and Dust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* ---------------- Main Layout Layer ---------------- */}
      <div className="relative z-20 flex h-full flex-col justify-between px-6 py-6 md:px-16 md:py-10">
        
        {/* Header Navigation */}
        <header
          ref={headerRef}
          className="flex items-center justify-between border-b border-white/10 pb-6"
        >
          {/* Brand Logo */}
          <a href="#" className="group flex flex-col text-left">
            <span className="text-base md:text-lg font-black tracking-[0.3em] uppercase transition-colors group-hover:text-amber-400 font-hero-heading">
              MOMENTUM
            </span>
            <span className="text-[9px] font-semibold tracking-[0.45em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
              EXPEDITION & DOCUMENTARIES
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="flex items-center space-x-8 md:space-x-12">
            {["Chapters", "Expeditions", "Film", "Journal"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-white/70 hover:text-amber-400 transition-colors duration-300 group py-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            {/* CTA Header Button */}
            <button
              onClick={onOpenTrailer}
              className="hidden md:flex items-center space-x-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300"
            >
              <span>Watch Film</span>
            </button>
          </nav>
        </header>

        {/* Hero Central Content */}
        <main className="max-w-4xl pt-6 pb-10">
          {/* Eyebrow Label */}
          <div
            ref={(el) => (textElementsRef.current[0] = el)}
            className="mb-4 flex items-center space-x-3 text-amber-400"
          >
            <span className="h-[1px] w-8 bg-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em]">
              THE 2026 WORLD EXPEDITION
            </span>
          </div>

          {/* Massive Stacked 3-Line Headline */}
          <div className="overflow-hidden mb-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-black uppercase tracking-tight leading-[0.9] text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] font-hero-heading">
              <span
                ref={(el) => (titleLinesRef.current[0] = el)}
                className="inline-block"
              >
                A STORY
              </span>
              <br />
              <span
                ref={(el) => (titleLinesRef.current[1] = el)}
                className="inline-block"
              >
                TOLD IN
              </span>
              <br />
              <span
                ref={(el) => (titleLinesRef.current[2] = el)}
                className="inline-block"
              >
                MOTION
                <span className="inline-block text-amber-500 animate-pulse ml-1">
                  .
                </span>
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            ref={(el) => (textElementsRef.current[1] = el)}
            className="max-w-xl text-sm sm:text-base md:text-lg font-light leading-relaxed text-white/70 tracking-wide mb-10 drop-shadow"
          >
            An unscripted cinematic journey into the most remote alpine peaks, desert basins, and deep ocean abysses on Earth.
          </p>

          {/* Magnetic Call to Actions */}
          <div
            ref={(el) => (textElementsRef.current[2] = el)}
            className="flex flex-wrap items-center gap-6 sm:gap-10"
          >
            {/* Pill Watch Trailer Button */}
            <button
              ref={primaryBtnRef}
              onClick={onOpenTrailer}
              onMouseMove={(e) => handleMagneticMove(e, primaryBtnRef)}
              onMouseLeave={() => handleMagneticLeave(primaryBtnRef)}
              className="magnetic-btn group relative flex items-center space-x-3.5 rounded-full border border-white/30 bg-black/40 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-400">
                <svg className="h-3 w-3 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white group-hover:text-amber-300 transition-colors">
                Watch Trailer
              </span>
            </button>

            {/* Ghost Explore Link with Animated Underline */}
            <a
              ref={exploreBtnRef}
              href="#sequence"
              onMouseMove={(e) => handleMagneticMove(e, exploreBtnRef)}
              onMouseLeave={() => handleMagneticLeave(exploreBtnRef)}
              className="magnetic-btn group flex items-center space-x-3 text-xs font-bold uppercase tracking-[0.25em] text-white/80 hover:text-white transition-colors py-2"
            >
              <span>Explore The Film</span>
              <span className="h-[1px] w-8 bg-white/40 transition-all duration-300 group-hover:w-14 group-hover:bg-amber-400" />
            </a>
          </div>
        </main>

        {/* Footer Festival Laurels */}
        <footer
          ref={laurelsRef}
          className="flex flex-wrap items-center gap-8 sm:gap-14 border-t border-white/10 pt-6"
        >
          {[
            { fest: "SUNDANCE", year: "2026 OFFICIAL SELECTION" },
            { fest: "HOT DOCS", year: "BEST CINEMATOGRAPHY" },
            { fest: "TRIBECA", year: "GRAND JURY PRIZE" },
          ].map((laurel, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 opacity-75 hover:opacity-100 transition-opacity cursor-default"
            >
              {/* Left Laurel Wreath */}
              <svg className="h-9 w-4 text-amber-500/80 fill-current" viewBox="0 0 20 50">
                <path d="M18,5 C10,12 5,25 6,45 C4,38 3,25 10,12 C13,7 16,5 18,5 Z" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="9" cy="28" r="2.2" />
                <circle cx="10" cy="38" r="2" />
              </svg>

              <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 font-hero-heading">
                  {laurel.fest}
                </p>
                <p className="text-[8px] font-mono tracking-widest text-white/60">
                  {laurel.year}
                </p>
              </div>

              {/* Right Laurel Wreath */}
              <svg className="h-9 w-4 text-amber-500/80 fill-current transform scale-x-[-1]" viewBox="0 0 20 50">
                <path d="M18,5 C10,12 5,25 6,45 C4,38 3,25 10,12 C13,7 16,5 18,5 Z" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="9" cy="28" r="2.2" />
                <circle cx="10" cy="38" r="2" />
              </svg>
            </div>
          ))}
        </footer>

        {/* Vertical "Scroll to explore" indicator on right edge */}
        <div
          ref={rightScrollRef}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-6 z-20"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 rotate-90 origin-center whitespace-nowrap">
            Scroll to Explore
          </span>
          <div className="relative h-20 w-[1px] bg-white/20 overflow-hidden">
            <div className="absolute top-0 left-0 h-8 w-full bg-gradient-to-b from-transparent via-amber-400 to-amber-500 animate-bounce" />
          </div>
          <div className="h-2 w-2 rounded-full border border-amber-400 bg-amber-400/40 animate-pulse" />
        </div>

      </div>
    </div>
  );
}
