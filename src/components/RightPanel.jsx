// src/components/RightPanel.jsx
import React, { useEffect, useState } from "react";
import { FiClock, FiStar, FiTrash2, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

export default function RightPanel({
  theme = "dark",
  currentCity = "",
  onSelectCity = () => {},
  isOpen = true,
  toggleOpen = () => {},
}) {
  const STORAGE_KEY = "weather-favorites";
  const PANEL_WIDTH = 300; // px
  const [now, setNow] = useState(new Date());
  const [favorites, setFavorites] = useState([]);

  // load favorites on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to read favorites:", e);
    }
  }, []);

  // clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const saveFavorites = (list) => {
    setFavorites(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to write favorites:", e);
    }
  };

  const addFavorite = () => {
    if (!currentCity || !currentCity.trim()) return;
    const city = currentCity.trim();
    if (favorites.includes(city)) return;
    const next = [city, ...favorites].slice(0, 12);
    saveFavorites(next);
  };

  const removeFavorite = (city) => {
    const next = favorites.filter((c) => c !== city);
    saveFavorites(next);
  };

  const handleClickFav = (city) => {
    if (typeof onSelectCity === "function") onSelectCity(city);
    const main = document.getElementById("main-scroll");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const panelStyle = {
    width: `${PANEL_WIDTH}px`,
    right: isOpen ? 0 : `-${PANEL_WIDTH}px`,
    top: 0,
    height: "100vh",
    position: "fixed",
    zIndex: 40,
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "right 0.3s ease-in-out",
    background: theme === "dark" ? "rgba(18,18,18,0.95)" : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderLeft: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    pointerEvents: "auto", // Block interaction when open
  };

  // FIXED TOGGLE BUTTON at top-right
  const toggleButtonStyle = {
    position: "fixed",
    right: isOpen ? `${PANEL_WIDTH + 10}px` : "10px",
    top: "20px",
    zIndex: 50,
    padding: "10px",
    borderRadius: "8px",
    background: theme === "dark" ? "rgba(18,18,18,0.95)" : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(14px)",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.15)",
    transition: "right 0.3s ease-in-out",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  };

  const smallBtn = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "6px 8px",
    borderRadius: "8px",
  };

  return (
    <>
      {/* FIXED TOGGLE BUTTON - Always visible at top */}
      <button
        onClick={toggleOpen}
        title={isOpen ? "Close favorites panel" : "Open favorites panel"}
        style={toggleButtonStyle}
      >
        {isOpen ? (
          <FiChevronRight className="w-5 h-5 text-white/90" />
        ) : (
          <FiChevronLeft className="w-5 h-5 text-white/90" />
        )}
      </button>

      {/* PANEL - Only visible when isOpen is true */}
      {isOpen && (
        <aside style={panelStyle} aria-label="Right info panel">
          {/* Top row: clock + add favorite (star) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-white/90" />
              <div>
                <div className="text-sm text-white/90">Local time</div>
                <div className="text-lg font-semibold text-white/100">
                  {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="text-xs text-white/70">{now.toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* ADD FAVORITE star icon */}
              <button
                title="Add current city to favorites"
                onClick={addFavorite}
                className="flex items-center gap-2 hover:bg-white/10 transition-colors"
                style={smallBtn}
              >
                {favorites.includes(currentCity.trim()) ? (
                  <AiFillStar className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FiStar className="w-5 h-5 text-white/90" />
                )}
              </button>
            </div>
          </div>

          {/* Favorites */}
          <div className="mt-4 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-white/90 flex items-center gap-2 font-semibold">
                <FiStar className="w-4 h-4" /> Favorites
              </div>
              <button
                title="Clear all favorites"
                onClick={() => saveFavorites([])}
                className="text-xs text-white/70 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="text-sm text-white/60 bg-white/5 p-4 rounded-lg border border-white/10">
                No favorites yet. Click the star to add the current city.
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {favorites.map((c) => (
                  <li key={c} className="flex items-center justify-between gap-2 group">
                    <button
                      onClick={() => handleClickFav(c)}
                      className="flex-1 text-left px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-white/90 border border-white/5 hover:border-white/20"
                    >
                      {c}
                    </button>
                    <button
                      onClick={() => removeFavorite(c)}
                      title="Remove from favorites"
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-xs text-white/50 bg-white/5 p-3 rounded-lg border border-white/5">
            💡 Tip: Click any favorite to quickly switch locations
          </div>
        </aside>
      )}
    </>
  );
}