import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [follower, setFollower] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add custom cursor class to body on desktop
    if (window.innerWidth >= 1024) {
      document.body.classList.add("has-custom-cursor");
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isCard = target.closest('[data-cursor="pointer"]');
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("[data-cursor]") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON";

      setIsCardHovered(!!isCard);
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // Smooth lag for outer follower ring
  useEffect(() => {
    let animationFrameId;

    const render = () => {
      setFollower((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden lg:block">
      {/* Center Dot */}
      <div
        className="fixed h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.6 : 1})`,
        }}
      />

      {/* Trailing Outer Ring with Drag Badge */}
      <div
        className="fixed flex items-center justify-center rounded-full border border-amber-400/50 backdrop-blur-[1px] transition-all duration-300 ease-out"
        style={{
          left: `${follower.x}px`,
          top: `${follower.y}px`,
          width: isCardHovered ? "80px" : "40px",
          height: isCardHovered ? "80px" : "40px",
          transform: `translate(-50%, -50%) scale(${isHovered && !isCardHovered ? 1.8 : 1})`,
          backgroundColor: isHovered ? "rgba(245, 158, 11, 0.15)" : "transparent",
          borderColor: isHovered ? "rgba(245, 158, 11, 0.8)" : "rgba(245, 158, 11, 0.35)",
        }}
      >
        {isCardHovered && (
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-amber-300 animate-pulse">
            DRAG / DECK
          </span>
        )}
      </div>
    </div>
  );
}
