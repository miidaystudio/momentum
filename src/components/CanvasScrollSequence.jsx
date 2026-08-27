import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// 5 Chapters metadata
const CHAPTERS = [
  {
    id: "01",
    total: "05",
    title: "THE ALTAI PEAKS",
    subtitle: "GLACIAL RIDGES & ALPINE SILENCE",
    location: "Siberian-Mongolian Borderland • Elev 4,500m",
    description:
      "Where wind carves razor-sharp ice needles out of granite massifs. Silence reigns in the highest pass on Earth.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop",
    accent: "#f59e0b",
  },
  {
    id: "02",
    total: "05",
    title: "ATACAMA BASIN",
    subtitle: "INFINITE HORIZONS & SOLAR WASTES",
    location: "High Atacama Desert, Chile • Elev 2,400m",
    description:
      "Salt flats bleached by relentless solar rays. At dusk, cobalt night unfolds under untamed celestial canopy.",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2560&auto=format&fit=crop",
    accent: "#f97316",
  },
  {
    id: "03",
    total: "05",
    title: "NORDIC FJORDS",
    subtitle: "DEEP WATERS & BLACK BASALT",
    location: "Vesterålen Archipelago, Norway • 68° N",
    description:
      "Glacial black walls plunging into icy ocean abysses. Humpback whales break the glass surface at dawn.",
    image:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2560&auto=format&fit=crop",
    accent: "#38bdf8",
  },
  {
    id: "04",
    total: "05",
    title: "BOREAL TAIGA",
    subtitle: "SUBARCTIC CANOPY & FROZEN RIVERS",
    location: "Yukon Territory, Canada • Subarctic Belt",
    description:
      "Endless spruce wilderness blanketed in hoarfrost. Emerald aurora borealis dances across nocturnal rivers.",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2560&auto=format&fit=crop",
    accent: "#10b981",
  },
  {
    id: "05",
    total: "05",
    title: "PACIFIC ABYSS",
    subtitle: "OCEAN CRAGS & EMERALD TIDES",
    location: "Haida Gwaii Archipelago, Pacific Rim",
    description:
      "Ancient temperate rainforest meets crashing Pacific swells. The edge where continental crust collapses into ocean depths.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop",
    accent: "#6366f1",
  },
];

export default function CanvasScrollSequence() {
  const pinSectionRef = useRef(null);
  const canvasRef = useRef(null);

  // States
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  // ----------------------------------------------------
  // 1. Image Sequence Preloader
  // ----------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const imgArray = [];
    let loadedCount = 0;

    CHAPTERS.forEach((chap, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = chap.image;
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / CHAPTERS.length) * 100));
        if (loadedCount === CHAPTERS.length) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / CHAPTERS.length) * 100));
        if (loadedCount === CHAPTERS.length) {
          setIsLoading(false);
        }
      };
      imgArray.push(img);
    });

    setLoadedImages(imgArray);

    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------
  // 2. GSAP ScrollTrigger Viewport Pinning & Canvas Scrub
  // ----------------------------------------------------
  useEffect(() => {
    if (isLoading || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      renderFrame(progressPercent / 100);
    };
    window.addEventListener("resize", handleResize);

    // Frame interpolation renderer
    const renderFrame = (progress) => {
      ctx.clearRect(0, 0, width, height);

      // Calculate smooth interpolation across loaded chapter images
      const totalChapters = CHAPTERS.length;
      const exactIndex = progress * (totalChapters - 1);
      const baseIdx = Math.floor(exactIndex);
      const nextIdx = Math.min(totalChapters - 1, baseIdx + 1);
      const factor = exactIndex - baseIdx;

      const imgA = loadedImages[baseIdx];
      const imgB = loadedImages[nextIdx];

      // Draw Base Image with cover aspect ratio & scale effect
      if (imgA && imgA.complete) {
        ctx.globalAlpha = 1;
        drawCoverImage(ctx, imgA, width, height, 1 + (1 - factor) * 0.05);
      }

      // Blend Next Image with crossfade factor
      if (imgB && imgB.complete && factor > 0) {
        ctx.globalAlpha = factor;
        drawCoverImage(ctx, imgB, width, height, 1.05 - factor * 0.05);
      }

      // Draw Atmospheric Dust Overlay on top of frames
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(0, 0, width, height);
    };

    // Helper to draw cover-fitted image on canvas
    function drawCoverImage(context, img, w, h, scale = 1) {
      if (!img || !img.width) return;
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let renderW, renderH, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        renderW = w * scale;
        renderH = (w / imgRatio) * scale;
      } else {
        renderH = h * scale;
        renderW = h * imgRatio * scale;
      }
      offsetX = (w - renderW) / 2;
      offsetY = (h - renderH) / 2;

      context.drawImage(img, offsetX, offsetY, renderW, renderH);
    }

    // Initial draw
    renderFrame(0);

    // ScrollTrigger Pinning Setup
    const pinTrigger = ScrollTrigger.create({
      trigger: pinSectionRef.current,
      start: "top top",
      end: "+=350%", // 3.5x viewport scroll distance for smooth scrubbing
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const prog = self.progress;
        setProgressPercent(Math.round(prog * 100));

        // Determine active chapter (0 to 4)
        const chapterIdx = Math.min(
          CHAPTERS.length - 1,
          Math.floor(prog * CHAPTERS.length)
        );
        setActiveChapterIndex(chapterIdx);

        renderFrame(prog);
      },
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      pinTrigger.kill();
    };
  }, [isLoading, loadedImages]);

  const activeChap = CHAPTERS[activeChapterIndex];

  return (
    <section
      id="sequence"
      ref={pinSectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#08070b] text-white select-none"
    >
      {/* Preloader Loading Bar */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#08070b] p-6 text-center">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
            PRELOADING EXPEDITION FRAMES
          </div>
          <div className="h-1 w-64 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="mt-3 font-mono text-xs text-white/50">{loadProgress}%</span>
        </div>
      )}

      {/* ---------------- Desktop Canvas Scrub ---------------- */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        {/* HTML5 Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-grain mix-blend-screen" />

        {/* ---------------- Overlay UI ---------------- */}
        <div className="relative z-20 flex h-full flex-col justify-between p-12 md:p-16 pointer-events-none">
          
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400">
              EXPEDITION SCROLL SEQUENCE
            </span>
            <span className="font-mono text-xs text-white/60">
              FRAME PROGRESS: {progressPercent.toString().padStart(2, "0")}%
            </span>
          </div>

          {/* Center Left Progress Line & Dots */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-6 pointer-events-auto">
            <div className="relative h-48 w-[2px] bg-white/15">
              <div
                className="absolute top-0 left-0 w-full bg-amber-400 transition-all duration-100"
                style={{ height: `${progressPercent}%` }}
              />
            </div>
            {CHAPTERS.map((chap, idx) => (
              <button
                key={chap.id}
                onClick={() => {
                  if (pinSectionRef.current) {
                    const scrollTarget =
                      pinSectionRef.current.offsetTop +
                      (idx / (CHAPTERS.length - 1)) * (window.innerHeight * 3.5);
                    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
                  }
                }}
                className={`group flex items-center space-x-3 transition-all ${
                  activeChapterIndex === idx ? "scale-125 opacity-100" : "opacity-40 hover:opacity-80"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full border transition-all ${
                    activeChapterIndex === idx
                      ? "border-amber-400 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      : "border-white/50 bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Main Editorial Text Card (Crossfading per Chapter) */}
          <div className="max-w-xl self-end text-right pr-6 pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl transition-all duration-500">
            {/* Number Counter */}
            <div className="flex items-center justify-end space-x-2 text-amber-400 mb-2 font-mono">
              <span className="text-3xl font-black">{activeChap.id}</span>
              <span className="text-sm opacity-50">/ {activeChap.total}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-hero-heading mb-1">
              {activeChap.title}
            </h2>

            {/* Subtitle */}
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/90 mb-4">
              {activeChap.subtitle}
            </p>

            {/* Location */}
            <p className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4">
              {activeChap.location}
            </p>

            {/* Description */}
            <p className="text-sm font-light leading-relaxed text-white/80 tracking-wide mb-6">
              {activeChap.description}
            </p>

            {/* Action link */}
            <a
              href="#journal"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors"
            >
              <span>Explore Chapter Journal</span>
              <span>→</span>
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
              PINNED VIEWPORT SCRUBBING
            </span>
            <span className="text-[10px] font-mono text-white/40">
              APEX EXPEDITION SYSTEM v2.6
            </span>
          </div>

        </div>
      </div>

      {/* ---------------- Mobile Responsive Carousel Fallback ---------------- */}
      <div className="lg:hidden relative h-full w-full flex flex-col justify-between p-6">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <img
            src={CHAPTERS[mobileSlideIndex].image}
            alt={CHAPTERS[mobileSlideIndex].title}
            className="h-full w-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
              EXPEDITION CHAPTERS
            </span>
            <span className="font-mono text-xs text-white/70">
              {CHAPTERS[mobileSlideIndex].id} / {CHAPTERS[mobileSlideIndex].total}
            </span>
          </div>

          {/* Center Card */}
          <div className="my-auto bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-400">
              {CHAPTERS[mobileSlideIndex].subtitle}
            </span>
            <h2 className="text-3xl font-black uppercase text-white font-hero-heading mt-1 mb-2">
              {CHAPTERS[mobileSlideIndex].title}
            </h2>
            <p className="text-xs font-mono text-white/50 mb-3">
              {CHAPTERS[mobileSlideIndex].location}
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              {CHAPTERS[mobileSlideIndex].description}
            </p>
          </div>

          {/* Touch Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() =>
                setMobileSlideIndex((prev) =>
                  prev === 0 ? CHAPTERS.length - 1 : prev - 1
                )
              }
              className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>PREV</span>
            </button>

            <div className="flex space-x-1.5">
              {CHAPTERS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    mobileSlideIndex === i ? "w-6 bg-amber-400" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setMobileSlideIndex((prev) => (prev + 1) % CHAPTERS.length)
              }
              className="flex items-center space-x-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-white"
            >
              <span>NEXT</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
