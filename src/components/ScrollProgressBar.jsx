import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const anim = gsap.to(el, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/5 pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 origin-left scale-x-0 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
      />
    </div>
  );
}
