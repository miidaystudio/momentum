import React, { useState } from "react";
import { Search, MapPin, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { PRESETS } from "../services/openTripMap";

export default function DestinationSelector({
  currentRegion,
  onSearch,
  isLoading,
  error,
  onRetry,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setIsDropdownOpen(false);
    }
  };

  const handleSelectPreset = (presetQuery) => {
    setSearchInput(presetQuery);
    onSearch(presetQuery);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative z-40 w-full max-w-2xl mx-auto px-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-amber-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={`Search expedition region (e.g. Chamonix, Patagonia, Reykjavik)...`}
            className="w-full rounded-full border border-white/20 bg-black/60 px-11 py-3.5 text-xs text-white placeholder-white/40 backdrop-blur-md focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all shadow-xl"
          />

          {isLoading && (
            <RefreshCw className="absolute right-4 h-4 w-4 text-amber-400 animate-spin" />
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="ml-3 rounded-full bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          Explore
        </button>
      </form>

      {/* Preset Quick Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/40 mr-1 flex items-center space-x-1">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>PRESETS:</span>
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleSelectPreset(preset.query)}
            className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-all border ${
              currentRegion?.toLowerCase() === preset.query.toLowerCase() ||
              currentRegion?.toLowerCase() === preset.name.toLowerCase()
                ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/60 p-4 backdrop-blur-md flex items-center justify-between text-xs text-red-200 shadow-xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-4 rounded-full border border-red-400/40 bg-red-900/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
