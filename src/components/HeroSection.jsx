import React from 'react';

export default function HeroSection({ scrollToSection }) {
  return (
    <div id="hero" className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white select-none">
      {/* Background Image (Zero-Gravity Cave Arch & Floating Rocks style) */}
      <img
        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
        alt="Zero-Gravity Cave Arch"
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.8]"
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 md:p-12 lg:p-16">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between">
          {/* Sun Logo */}
          <div 
            onClick={() => scrollToSection('hero')}
            className="cursor-pointer text-[#F4A817] transition-transform hover:scale-110"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M12 2L13 5.5L12 7L11 5.5Z"
                  transform={`rotate(${i * 30} 12 12)`}
                />
              ))}
            </svg>
          </div>

          {/* Nav Links */}
          <nav className="flex space-x-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A93C]">
            <button onClick={() => scrollToSection('examples')} className="transition-colors hover:text-white cursor-pointer bg-transparent border-none font-semibold uppercase tracking-[0.25em]">
              Examples
            </button>
            <button onClick={() => scrollToSection('about')} className="transition-colors hover:text-white cursor-pointer bg-transparent border-none font-semibold uppercase tracking-[0.25em]">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="transition-colors hover:text-white cursor-pointer bg-transparent border-none font-semibold uppercase tracking-[0.25em]">
              Contact
            </button>
          </nav>
        </header>

        {/* Center Hero Content */}
        <main className="flex flex-col items-center justify-center text-center">
          {/* Subtitle */}
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#E5A93C] tracking-wide mb-2 opacity-90">
            Lighting the Way to
          </p>

          {/* Main Title */}
          <h1 className="max-w-5xl text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#F7AB1E] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] leading-[0.95] font-hero-heading">
            Your Next<br />Adventure
          </h1>

          {/* Enter Button */}
          <div className="mt-8 md:mt-12">
            <button 
              onClick={() => scrollToSection('horizon')}
              className="border border-[#7c5922] bg-black/40 px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#F7AB1E] backdrop-blur-xs transition-all duration-300 hover:border-[#F7AB1E] hover:bg-[#F7AB1E]/10 hover:shadow-[0_0_15px_rgba(247,171,30,0.3)] cursor-pointer"
            >
              Enter
            </button>
          </div>
        </main>

        {/* Footer Info / Controls */}
        <footer className="flex items-end justify-between">
          {/* Slide Indicator */}
          <div className="flex items-baseline font-bold">
            <span className="text-2xl md:text-3xl text-[#F7AB1E] tracking-tighter font-hero-heading">01</span>
            <span className="ml-1 text-sm font-semibold text-[#8a6829]">/04</span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-6 text-[#8a6829]">
            <button 
              onClick={() => scrollToSection('hero')}
              className="transition-colors hover:text-[#F7AB1E] cursor-pointer p-1" 
              aria-label="Previous slide"
              disabled
            >
              <svg className="h-5 w-5 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button 
              onClick={() => scrollToSection('horizon')}
              className="transition-colors hover:text-[#F7AB1E] cursor-pointer p-1" 
              aria-label="Next slide"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
