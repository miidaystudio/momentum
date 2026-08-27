import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, MapPin, ArrowLeft, ChevronRight, ChevronLeft, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalExpeditionMap({
  regionInfo = null,
  panels = [],
  isLoading = false,
  error = null,
  onResetSearch,
  onOpenTrailer,
}) {
  const pinSectionRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const panelRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  // GSAP ScrollTrigger Viewport Pinning & Horizontal Scroll
  useEffect(() => {
    if (isLoading || !panels || panels.length === 0) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const totalPanels = panels.length;
      const trigger = ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: "top top",
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const prog = self.progress;
          setScrollProgress(prog);

          const xOffset = -prog * (container.scrollWidth - window.innerWidth);
          gsap.set(container, { x: xOffset });

          const currIdx = Math.min(
            totalPanels - 1,
            Math.floor(prog * totalPanels + 0.1)
          );
          setActiveIndex(currIdx);

          panelRefs.current.forEach((panelEl, idx) => {
            if (!panelEl) return;
            const imgEl = panelEl.querySelector(".panel-bg-img");
            if (imgEl) {
              const panelProgress = (idx / (totalPanels - 1)) - prog;
              gsap.set(imgEl, {
                scale: 1.05 + Math.abs(panelProgress) * 0.15,
                x: panelProgress * 60,
              });
            }
          });
        },
      });

      return () => trigger.kill();
    }, pinSectionRef);

    return () => ctx.revert();
  }, [panels, isLoading]);

  // HTML5 Canvas Route Line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || panels.length === 0) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 100);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 100;
    };
    window.addEventListener("resize", handleResize);

    const renderCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      const totalPanels = panels.length;
      const startX = 60;
      const endX = width - 60;
      const routeY = 50;

      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(startX, routeY);
      ctx.lineTo(endX, routeY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const activeLength = startX + (endX - startX) * scrollProgress;
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(startX, routeY);
      ctx.lineTo(activeLength, routeY);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#f59e0b";
      ctx.stroke();
      ctx.shadowBlur = 0;

      panels.forEach((_, idx) => {
        const pinX = startX + (endX - startX) * (idx / Math.max(1, totalPanels - 1));
        const isActive = activeIndex === idx;

        ctx.beginPath();
        ctx.arc(pinX, routeY, isActive ? 8 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#f59e0b" : "rgba(255, 255, 255, 0.4)";
        if (isActive) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#f59e0b";
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isActive) {
          ctx.beginPath();
          ctx.arc(pinX, routeY, 14, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
    };

    renderCanvas();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollProgress, activeIndex, panels]);

  if (isLoading) {
    return (
      <section className="relative w-full py-20 bg-[#08070b] flex flex-col items-center justify-center p-6 text-center text-white border-t border-white/10">
        <Compass className="h-10 w-10 text-amber-400 animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400 mb-2">
          GEOCODING OPENTRIPMAP TELEMETRY
        </span>
        <div className="h-1.5 w-64 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-amber-400 animate-pulse w-2/3" />
        </div>
      </section>
    );
  }

  if (error || !panels || panels.length === 0) {
    return (
      <section className="relative w-full py-16 bg-[#08070b] flex flex-col items-center justify-center p-6 text-center text-white border-t border-white/10">
        <div className="max-w-md p-8 rounded-3xl border border-white/10 bg-[#0d0e12]">
          <Compass className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase text-white mb-2">
            NO POIs DISCOVERED NEARBY
          </h3>
          <p className="text-xs text-white/60 mb-6 leading-relaxed">
            {error || "Try searching another destination or select a preset region above."}
          </p>
          <button
            onClick={onResetSearch}
            className="rounded-full bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition-colors"
          >
            New Location Search
          </button>
        </div>
      </section>
    );
  }

  const currentPanel = panels[activeIndex] || panels[0];

  return (
    <section
      id="map-section"
      ref={pinSectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#08070b] text-white select-none antialiased"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-6 left-6 right-6 md:left-16 md:right-16 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={onResetSearch}
            className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:border-amber-400 hover:text-amber-400 transition-colors shadow-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>NEW SEARCH</span>
          </button>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
              {regionInfo?.regionName || "EXPEDITION"} MAP
            </span>
            <span className="text-[9px] font-mono text-white/50">
              {regionInfo?.coords}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
            WAYPOINT:
          </span>
          <div className="font-mono text-sm font-black text-white">
            <span>{currentPanel?.id}</span>
            <span className="text-white/40 font-normal"> / {panels.length.toString().padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Scroll Panels */}
      <div
        ref={containerRef}
        className="hidden lg:flex h-full w-max flex-nowrap will-change-transform"
      >
        {panels.map((panel, idx) => (
          <div
            key={panel.xid + idx}
            ref={(el) => (panelRefs.current[idx] = el)}
            className="relative h-full w-screen flex-shrink-0 p-12 md:p-20 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={panel.image}
                alt={panel.title}
                className="panel-bg-img h-full w-full object-cover object-center transition-transform duration-700 ease-out will-change-transform opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-black/40 to-black/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
              <div className="absolute inset-0 opacity-[0.035] bg-grain mix-blend-screen" />
            </div>

            <div className="relative z-10 pt-16 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md">
                  {panel.kindTag}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/60">
                  RATE {panel.rate} / 7
                </span>
              </div>
            </div>

            <div className="relative z-10 my-auto max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400 mb-3 block">
                {panel.subtitle}
              </span>

              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white font-hero-heading leading-[0.92] drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] mb-6">
                {panel.title}
              </h2>

              <p className="text-sm md:text-base font-light leading-relaxed text-white/80 tracking-wide max-w-2xl line-clamp-4 drop-shadow">
                {panel.description}
              </p>
            </div>

            <div className="relative z-10 pb-16 flex items-center justify-between border-t border-white/15 pt-6">
              <div className="flex items-center space-x-2 text-xs font-mono text-white/60">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>{panel.location}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Mobile Touch Carousel */}
      <div className="lg:hidden relative h-full w-full flex flex-col justify-between p-6 pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src={panels[mobileIndex]?.image}
            alt={panels[mobileIndex]?.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 my-auto">
            <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300 inline-block mb-3">
              {panels[mobileIndex]?.kindTag}
            </span>

            <h2 className="text-3xl font-black uppercase text-white font-hero-heading mb-3">
              {panels[mobileIndex]?.title}
            </h2>

            <p className="text-xs font-mono text-white/50 mb-3">
              {panels[mobileIndex]?.location}
            </p>

            <p className="text-xs text-white/80 leading-relaxed line-clamp-4">
              {panels[mobileIndex]?.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() =>
                setMobileIndex((prev) => (prev === 0 ? panels.length - 1 : prev - 1))
              }
              className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>PREV</span>
            </button>

            <span className="font-mono text-xs text-amber-400">
              {panels[mobileIndex]?.id} / {panels.length.toString().padStart(2, "0")}
            </span>

            <button
              onClick={() =>
                setMobileIndex((prev) => (prev + 1) % panels.length)
              }
              className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-white"
            >
              <span>NEXT</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Route Line */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-[100px] z-20 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

    </section>
  );
}
