import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "01",
    subtitle: "Lighting the Way to",
    title: "YOUR NEXT\nADVENTURE",
    image: "/slide1-cave-arch.jpg",
  },
  {
    id: "02",
    subtitle: "Chasing Dreams",
    title: "BEYOND THE\nHORIZON",
    image: "/slide2-red-canyon.jpg",
  },
  {
    id: "03",
    subtitle: "Into the Unknown",
    title: "THE UNSEEN\nREALM",
    image: "/slide3-rift.jpg",
  },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  // Scroll wheel trigger
  useEffect(() => {
    let timeout;
    const handleWheel = (e) => {
      if (timeout) return;
      if (e.deltaY > 30) paginate(1);
      else if (e.deltaY < -30) paginate(-1);
      timeout = setTimeout(() => (timeout = null), 800);
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const current = slides[index];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-[#F7AB1E] select-none font-sans">
      <AnimatePresence initial={false} custom={direction}>
        {/* Background Zoom Transition */}
        <motion.div
          key={index}
          custom={direction}
          initial={{
            scale: direction > 0 ? 0.7 : 2.5,
            opacity: 0,
            filter: "blur(12px)",
          }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            scale: direction > 0 ? 2.5 : 0.7,
            opacity: 0,
            filter: "blur(16px)",
            transition: { duration: 0.7, ease: [0.7, 0, 0.84, 0] },
          }}
          className="absolute inset-0 h-full w-full"
        >
          <img
            src={current.image}
            alt={current.title}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Central Blur Mask to cover the baked-in yellow text on slide 1 and 2 screenshots */}
      {(index === 0 || index === 1) && (
        <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px] h-[35%] bg-black/95 blur-[40px] z-10 rounded-full pointer-events-none" />
      )}

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none z-10" />

      {/* Interface Layer */}
      <div className="relative z-20 flex h-full flex-col justify-between p-8 md:p-14">
        {/* Header */}
        <header className="flex items-center justify-between">
          <span className="text-2xl cursor-pointer text-[#F4A817] hover:scale-110 transition duration-300">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4.2" />
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M12 2L13 5.5L12 7L11 5.5Z"
                  transform={`rotate(${i * 30} 12 12)`}
                />
              ))}
            </svg>
          </span>
          <nav className="flex space-x-8 text-xs font-bold tracking-[0.25em] text-[#E5A93C]">
            <a href="#examples" className="transition hover:text-white">EXAMPLES</a>
            <a href="#about" className="transition hover:text-white">ABOUT</a>
            <a href="#contact" className="transition hover:text-white">CONTACT</a>
          </nav>
        </header>

        {/* Text Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={index}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.4, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <p className="font-serif italic text-xl md:text-2xl opacity-90 mb-2 text-[#E5A93C]">
              {current.subtitle}
            </p>
            <h1 className="whitespace-pre-line text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tight leading-[0.9] text-[#F7AB1E] font-hero-heading drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)]">
              {current.title}
            </h1>
            <button className="mt-8 border border-[#7c5922] bg-black/40 px-8 py-2 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur hover:border-[#F7AB1E] text-[#F7AB1E] transition-all hover:bg-[#F7AB1E]/20 hover:shadow-[0_0_20px_rgba(247,171,30,0.4)] cursor-pointer">
              Enter
            </button>
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="flex items-end justify-between">
          <div className="flex items-baseline font-bold">
            <span className="text-3xl text-[#F7AB1E]">{current.id}</span>
            <span className="ml-1 text-sm text-[#8a6829]">/03</span>
          </div>

          <div className="flex space-x-6 text-xl text-[#8a6829]">
            <button onClick={() => paginate(-1)} className="hover:text-[#F7AB1E] transition-colors p-1 cursor-pointer">←</button>
            <button onClick={() => paginate(1)} className="hover:text-[#F7AB1E] transition-colors p-1 cursor-pointer">→</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
