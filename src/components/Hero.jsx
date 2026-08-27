import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Laurel SVG component for cinematic look
const LaurelOrnament = ({ festival, year }) => (
  <div className="flex items-center space-x-2 text-neutral-300 select-none">
    {/* Left Branch */}
    <svg className="w-8 h-10 opacity-70 fill-amber-500/80" viewBox="0 0 24 32">
      <path d="M12 2C6.5 6 3 12 4 20C4.5 24 7 28 12 30C10 26 8 20 8 14C8 10 10 6 12 2Z" />
      <path d="M8 8C5 11 3.5 15 4 20" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
    
    <div className="flex flex-col text-center px-1">
      <span className="text-[7px] tracking-[0.3em] font-semibold text-neutral-400 uppercase">Official Selection</span>
      <span className="text-[10px] tracking-[0.2em] font-bold text-white uppercase font-hero-heading">{festival}</span>
      <span className="text-[8px] tracking-[0.25em] text-amber-500 font-medium">{year}</span>
    </div>

    {/* Right Branch */}
    <svg className="w-8 h-10 opacity-70 fill-amber-500/80 transform scale-x-[-1]" viewBox="0 0 24 32">
      <path d="M12 2C6.5 6 3 12 4 20C4.5 24 7 28 12 30C10 26 8 20 8 14C8 10 10 6 12 2Z" />
      <path d="M8 8C5 11 3.5 15 4 20" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

export default function Hero() {
  const images = [
    'https://images.unsplash.com/photo-1551824198-b5ed30edd39f?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1920'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-black">
      
      {/* Background Image Carousel with AnimatePresence */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%), 
                                linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), 
                                url('${images[currentIndex]}')` 
            }}
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-between h-full pt-32 pb-16">
        
        {/* Empty placeholder for alignment */}
        <div />

        {/* Hero Content */}
        <div className="max-w-2xl text-left mt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-normal text-white uppercase leading-[0.95] font-hero-heading"
          >
            A Story <br />
            Told In Motion<span className="text-amber-500">.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-neutral-300 text-sm sm:text-base md:text-lg tracking-wider font-light max-w-md leading-relaxed"
          >
            A cinematic journey into the lives, places, and truths that shape us.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a 
              href="#trailer"
              className="flex items-center space-x-3 border border-white hover:border-amber-500 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full text-xs font-semibold tracking-[0.2em] text-white transition-all duration-300 group cursor-pointer"
            >
              <span className="p-1.5 bg-white text-black group-hover:bg-amber-500 group-hover:text-black rounded-full transition-colors duration-300">
                <Play className="w-3.5 h-3.5 fill-current" />
              </span>
              <span>WATCH TRAILER</span>
            </a>
            
            <a 
              href="#chapters"
              className="text-xs font-semibold tracking-[0.2em] text-neutral-300 hover:text-white transition-all duration-300 flex items-center group cursor-pointer"
            >
              <span>EXPLORE THE FILM</span>
              <span className="ml-2 w-8 h-[1px] bg-neutral-400 group-hover:bg-amber-500 group-hover:w-12 transition-all duration-300" />
            </a>
          </motion.div>
        </div>

        {/* Laurels Showcase */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex flex-wrap items-center gap-8 md:gap-12 mt-12 border-t border-white/5 pt-8"
        >
          <LaurelOrnament festival="Sundance" year="2026" />
          <LaurelOrnament festival="Hot Docs" year="2026" />
          <LaurelOrnament festival="Tribeca" year="2026" />
        </motion.div>

      </div>

      {/* Right Scroll Indicator */}
      <div className="absolute right-8 bottom-16 z-10 hidden lg:flex flex-col items-center space-y-6">
        <motion.span 
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[9px] tracking-[0.5em] font-medium text-neutral-400 uppercase vertical-text transform rotate-180"
          style={{ writingMode: 'vertical-lr' }}
        >
          SCROLL TO EXPLORE
        </motion.span>
        
        <div className="relative w-[1px] h-24 bg-neutral-800 overflow-hidden">
          <motion.div 
            animate={{ y: [0, 96, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-amber-500 to-transparent"
          />
        </div>
        
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2.5 h-2.5 rounded-full border border-neutral-500 flex items-center justify-center"
        >
          <div className="w-1 h-1 bg-amber-500 rounded-full" />
        </motion.div>
      </div>

    </section>
  );
}
