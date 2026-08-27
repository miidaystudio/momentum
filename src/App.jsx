import React, { useEffect, useState } from "react";
import Lenis from "lenis";

// OpenTripMap API Service
import { getExpeditionDataForRegion } from "./services/openTripMap";

// Components
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import SearchHero from "./components/SearchHero";
import HorizontalExpeditionMap from "./components/HorizontalExpeditionMap";
import Chapters from "./components/Chapters";
import TrailerFooter from "./components/TrailerFooter";

export default function App() {
  const [currentRegionQuery, setCurrentRegionQuery] = useState("Chamonix");
  const [regionData, setRegionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Fetch OpenTripMap POI data on search query update
  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExpeditionDataForRegion(currentRegionQuery);
        if (isSubscribed) {
          setRegionData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("OpenTripMap API Error:", err);
          setError(err.message || "Failed to load destination POIs.");
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [currentRegionQuery]);

  const handleSearchDestination = (newQuery) => {
    if (newQuery && newQuery.trim() !== currentRegionQuery) {
      setCurrentRegionQuery(newQuery.trim());
      // Smooth scroll down to map section
      const mapSection = document.getElementById("map-section");
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleResetSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#08070b] text-[#f3f4f6] font-sans antialiased overflow-x-hidden">
      {/* Custom Follower Cursor */}
      <CustomCursor />

      {/* Header Navbar */}
      <Navbar />

      {/* 1. Landing / Search Hero */}
      <SearchHero
        currentRegion={regionData?.regionName || currentRegionQuery}
        onSearch={handleSearchDestination}
        isLoading={isLoading}
        error={error}
      />

      {/* 2. Horizontal Scroll Expedition Map (Core Results Feature) */}
      <HorizontalExpeditionMap
        regionInfo={regionData}
        panels={regionData?.panels || []}
        isLoading={isLoading}
        error={error}
        onResetSearch={handleResetSearch}
      />

      {/* 3. Expedition Journal & Field Dispatches */}
      <Chapters
        cardsData={regionData?.panels || []}
        regionInfo={regionData}
      />

      {/* 4. Footer & Newsletter */}
      <TrailerFooter />
    </div>
  );
}
