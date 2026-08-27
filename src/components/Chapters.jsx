import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Compass, MapPin, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Chapters({ cardsData = [], regionInfo = null, onOpenTrailer }) {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const stories =
    cardsData.length > 0
      ? cardsData.map((card, i) => ({
          id: i + 1,
          category: card.tag || "EXPEDITION WAYPOINT",
          title: card.title,
          date: "LIVE OPENTRIPMAP DISPATCH",
          location: card.location,
          readTime: "FIELD LOG",
          image: card.image,
          excerpt: card.description,
        }))
      : [
          {
            id: 1,
            category: "ALPINE RIDGE",
            title: "THE SILENT SUMMIT OF K2",
            date: "WINTER 2026",
            location: "Karakoram Range, Pakistan",
            readTime: "8 MIN READ",
            image:
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
            excerpt:
              "A grueling 40-day winter ascent where sub-zero temperatures turn breath to ice. Exposing the psychological perimeter of extreme altitude.",
          },
          {
            id: 2,
            category: "OCEAN ABYSS",
            title: "MAPPING THE MARIANA CREVICE",
            date: "SPRING 2026",
            location: "Western Pacific Basin",
            readTime: "12 MIN READ",
            image:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
            excerpt:
              "Descending 10,900 meters into pitch black hydrostatic pressure. Unearthing bioluminescent organisms untouched by solar light.",
          },
        ];

  // GSAP Headline clip-path curtain wipe & Card Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Headline Clip-Path Curtain Reveal
      if (headlineRef.current && !prefersReducedMotion) {
        gsap.fromTo(
          headlineRef.current,
          { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 2. Card entrance (scale from 0.96 + slide-up staggered) & image focusing (1.1 to 1.0)
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const imgEl = cardEl.querySelector(".card-focus-img");

        if (!prefersReducedMotion) {
          gsap.fromTo(
            cardEl,
            { y: 60, scale: 0.96, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 1,
              delay: idx * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardEl,
                start: "top 85%",
                once: true,
              },
            }
          );

          if (imgEl) {
            gsap.fromTo(
              imgEl,
              { scale: 1.1 },
              {
                scale: 1.0,
                duration: 1.4,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: cardEl,
                  start: "top 85%",
                  once: true,
                },
              }
            );

            // Vertical scroll parallax shift
            gsap.to(imgEl, {
              y: -25,
              ease: "none",
              scrollTrigger: {
                trigger: cardEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }
      });

      // 3. ScrollTrigger to drive Canvas route line progress
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stories]);

  // HTML5 Canvas Connecting Route Line (Bezier Curve connecting cards)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (width > 768 && cardRefs.current.length >= 2) {
        const card1 = cardRefs.current[0];
        const card2 = cardRefs.current[1];

        if (card1 && card2) {
          const rect1 = card1.getBoundingClientRect();
          const rect2 = card2.getBoundingClientRect();
          const parentRect = canvas.getBoundingClientRect();

          const x1 = rect1.left + rect1.width / 2 - parentRect.left;
          const y1 = rect1.top + 50 - parentRect.top;

          const x2 = rect2.left + rect2.width / 2 - parentRect.left;
          const y2 = rect2.top + 50 - parentRect.top;

          const controlX = (x1 + x2) / 2;
          const controlY = Math.min(y1, y2) - 80;

          // Draw Base Curved Dashed Route
          ctx.beginPath();
          ctx.setLineDash([8, 6]);
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(controlX, controlY, x2, y2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Active Animated Route Progress
          if (scrollProgress > 0) {
            ctx.beginPath();
            ctx.setLineDash([8, 6]);
            ctx.moveTo(x1, y1);

            // Interpolate quadratic curve based on scrollProgress
            const currentT = Math.min(1, scrollProgress * 1.3);
            const currX = (1 - currentT) * (1 - currentT) * x1 + 2 * (1 - currentT) * currentT * controlX + currentT * currentT * x2;
            const currY = (1 - currentT) * (1 - currentT) * y1 + 2 * (1 - currentT) * currentT * controlY + currentT * currentT * y2;

            ctx.quadraticCurveTo(
              x1 + (controlX - x1) * currentT,
              y1 + (controlY - y1) * currentT,
              currX,
              currY
            );

            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#f59e0b";
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          // Card 1 Pin Marker
          ctx.beginPath();
          ctx.arc(x1, y1, hoveredIndex === 0 ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = hoveredIndex === 0 ? "#f59e0b" : "rgba(245, 158, 11, 0.6)";
          if (hoveredIndex === 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#f59e0b";
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Card 2 Pin Marker
          ctx.beginPath();
          ctx.arc(x2, y2, hoveredIndex === 1 ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = hoveredIndex === 1 ? "#f59e0b" : "rgba(245, 158, 11, 0.6)";
          if (hoveredIndex === 1) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#f59e0b";
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollProgress, hoveredIndex]);

  return (
    <section
      id="journal"
      ref={sectionRef}
      className="relative w-full bg-[#08070b] py-24 sm:py-32 px-6 sm:px-12 md:px-16 text-white border-t border-white/5 select-none"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-16">
          <div>
            <div className="flex items-center space-x-3 text-amber-400 mb-3">
              {/* Continuously Pulsing Compass Dot */}
              <div className="relative flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <Compass className="relative h-4 w-4 text-amber-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.35em]">
                {regionInfo?.regionName
                  ? `${regionInfo.regionName.toUpperCase()} FIELD DISPATCHES`
                  : "EXPEDITION JOURNAL & ARCHIVE"}
              </span>
            </div>

            {/* Headline with GSAP Clip-Path Curtain Wipe */}
            <div ref={headlineRef}>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-hero-heading leading-tight">
                DISPATCHES FROM THE EDGE
              </h2>
            </div>
          </div>

          <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm font-light text-white/60 leading-relaxed">
            Curated field notes, OpenTripMap geographical extracts, and raw field logs from our global expedition crews.
          </p>
        </div>

        {/* Story Grid Container with Canvas Route Layer */}
        <div className="relative">
          {/* Connecting Canvas Route Line */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {stories.map((story, idx) => (
              <article
                key={story.id + story.title}
                ref={(el) => (cardRefs.current[idx] = el)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-[#0d0e12] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-[0_20px_50px_rgba(245,158,11,0.25)] h-full"
              >
                {/* Image Container with Hover Scale & Scroll Parallax */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="card-focus-img h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-black/40" />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400">
                    {story.category}
                  </span>

                  {/* Circular Arrow Icon (rotates 45° and fills amber on hover) */}
                  <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col justify-between p-6 sm:p-8 flex-1">
                  <div>
                    {/* Metadata Row */}
                    <div className="flex items-center space-x-4 text-[10px] font-mono tracking-widest text-white/50 group-hover:text-white/80 transition-colors mb-3">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="h-3 w-3 text-amber-400" />
                        <span>{story.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1.5">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>{story.readTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-hero-heading group-hover:text-amber-400 transition-colors mb-3 leading-tight">
                      {story.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-white/70 tracking-wide mb-6 line-clamp-3">
                      {story.excerpt}
                    </p>
                  </div>

                  {/* Footer Link */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                    <span className="text-[10px] font-mono text-white/40">{story.date}</span>
                    <button
                      onClick={onOpenTrailer}
                      className="group/btn flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors"
                    >
                      <span className="group-hover/btn:underline">Read Dispatch</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
