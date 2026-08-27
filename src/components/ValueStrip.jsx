import React, { useEffect, useRef } from "react";
import { Search, Compass, MapPin } from "lucide-react";
import gsap from "gsap";

export default function ValueStrip() {
  const sectionRef = useRef(null);
  const colRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardEl = entry.target;
            const iconEl = cardEl.querySelector(".icon-box");

            gsap.fromTo(
              cardEl,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );

            if (iconEl) {
              gsap.fromTo(
                iconEl,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, delay: 0.2, ease: "back.out(1.7)" }
              );
            }

            observer.unobserve(cardEl);
          }
        });
      },
      { threshold: 0.2 }
    );

    colRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Search,
      title: "SEARCH ANY PLACE",
      subtitle: "INSTANT GLOBAL GEOCODING",
      description:
        "Input any city, mountain peak, or region on Earth. OpenTripMap API resolves precise telemetry coordinates in milliseconds.",
    },
    {
      icon: Compass,
      title: "DISCOVER REAL SPOTS",
      subtitle: "VERIFIED POI DATA",
      description:
        "Scrub through real-world natural reserves, alpine ridges, and historical waypoints backed by Wikipedia extracts.",
    },
    {
      icon: MapPin,
      title: "PLAN YOUR TRIP",
      subtitle: "CANVAS ROUTE MAPPING",
      description:
        "Visualize your expedition route along an interactive animated canvas trail connecting real geographic coordinates.",
    },
  ];

  return (
    <section
      id="value-strip"
      ref={sectionRef}
      className="relative w-full bg-[#050507] py-20 px-6 sm:px-12 md:px-16 text-white border-t border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              ref={(el) => (colRefs.current[idx] = el)}
              className="flex flex-col text-left p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-amber-400/40 hover:bg-white/10"
            >
              <div className="icon-box flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-6">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">
                {item.subtitle}
              </span>
              <h3 className="text-xl font-black uppercase text-white font-hero-heading mb-3">
                {item.title}
              </h3>
              <p className="text-xs font-light text-white/70 leading-relaxed tracking-wide">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
