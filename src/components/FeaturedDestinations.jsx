import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { getCuratedFeaturedDestinations } from "../services/openTripMap";

export default function FeaturedDestinations({ onSelectDestination }) {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enriched fixed destination XIDs
  useEffect(() => {
    let isSubscribed = true;
    async function loadCurated() {
      try {
        const data = await getCuratedFeaturedDestinations();
        if (isSubscribed) {
          setDestinations(data);
          setIsLoading(false);
        }
      } catch {
        if (isSubscribed) setIsLoading(false);
      }
    }
    loadCurated();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // IntersectionObserver staggered scroll reveal + Image zoom-out-to-rest effect
  useEffect(() => {
    if (isLoading || destinations.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardEl = entry.target;
            const imgEl = cardEl.querySelector(".card-bg-img");

            // Card entrance
            gsap.fromTo(
              cardEl,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
            );

            // Image zoom-out-to-rest (starts at 1.08, settles to 1.0)
            if (imgEl) {
              gsap.fromTo(
                imgEl,
                { scale: 1.08 },
                { scale: 1.0, duration: 1.4, ease: "power2.out" }
              );
            }

            observer.unobserve(cardEl);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [destinations, isLoading]);

  // 3D Parallax tilt on card hover
  const handleMouseMove = (e, ref) => {
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(ref, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (ref) => {
    if (!ref) return;
    gsap.to(ref, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="relative w-full bg-[#08070b] py-24 sm:py-32 px-6 sm:px-12 md:px-16 text-white border-t border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-16">
          <div>
            <div className="flex items-center space-x-3 text-amber-400 mb-3">
              <Compass className="h-4 w-4 animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-[0.35em]">
                POPULAR EXPLORATION DESTINATIONS
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-hero-heading">
              WHERE EXPLORERS GO
            </h2>
          </div>

          <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm font-light text-white/60 leading-relaxed">
            Curated global waypoints enriched via OpenTripMap API telemetry. Click any card to launch into the expedition sequence.
          </p>
        </div>

        {/* Loading Shimmer State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl border border-white/10 bg-[#0d0e12] p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="h-4 w-28 bg-white/10 rounded-full" />
                <div className="space-y-3">
                  <div className="h-8 w-3/4 bg-white/15 rounded-lg" />
                  <div className="h-4 w-full bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {destinations.map((item, idx) => (
              <article
                key={item.name + idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                onClick={() => onSelectDestination(item.query)}
                onMouseMove={(e) => handleMouseMove(e, cardRefs.current[idx])}
                onMouseLeave={() => handleMouseLeave(cardRefs.current[idx])}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-[#0e1015] overflow-hidden cursor-pointer transition-all duration-500 hover:border-amber-400/60 hover:shadow-[0_20px_50px_rgba(245,158,11,0.25)] will-change-transform h-[420px]"
              >
                {/* Background Image with Zoom-Out-To-Rest */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-bg-img h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-black/40 to-black/60" />
                  <div className="absolute inset-0 opacity-[0.035] bg-grain mix-blend-screen" />
                </div>

                {/* Card Top Metadata */}
                <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300 backdrop-blur-md">
                    {item.tag}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-45 group-hover:bg-amber-400 group-hover:text-black">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Card Main Typography */}
                <div className="relative z-10 p-6 sm:p-8 mt-auto">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-hero-heading group-hover:text-amber-400 transition-colors mb-2 leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs font-light text-white/80 leading-relaxed line-clamp-2 mb-4">
                    {item.extract}
                  </p>

                  <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-amber-400">
                    <MapPin className="h-3 w-3" />
                    <span>LAUNCH EXPEDITION MAP →</span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
