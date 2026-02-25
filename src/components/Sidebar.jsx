// src/components/Sidebar.jsx
import React from "react";
import { FiMenu, FiSun, FiBarChart2, FiCalendar, FiMap, FiClock, FiFileText } from "react-icons/fi";

export default function Sidebar({ theme = "dark", isOpen = true, toggleSidebar }) {
  const SIDEBAR_WIDTH = 256; // px

  const sidebarStyle = {
    width: `${SIDEBAR_WIDTH}px`,
    transform: isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
    background: theme === "dark" ? "rgba(18, 18, 18, 0.14)" : "rgba(255, 255, 255, 0.10)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRight: theme === "dark" ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.10)",
  };

  const hamburgerStyle = {
    background: theme === "dark" ? "rgba(18,18,18,0.18)" : "rgba(255,255,255,0.20)",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  // Scroll helper: scrolls the main scroll container to the target element inside it
  const scrollMainTo = (sectionId) => {
    const main = document.getElementById("main-scroll");
    if (!main) {
      // fallback to document if main not found
      const targetFallback = document.getElementById(sectionId);
      targetFallback?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const target = main.querySelector(`#${sectionId}`);
    if (!target) return;
    // compute target position relative to the main scroll container
    const offsetTop = target.offsetTop;
    // optional: account for header height inside main if needed (e.g., header is part of main)
    // const headerHeight = 0;
    main.scrollTo({ top: offsetTop /* - headerHeight */, behavior: "smooth" });
  };

  return (
    <>
      {/* Persistent hamburger top-left */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        className="fixed z-60 top-4 left-4 p-2 rounded-md shadow-md flex items-center justify-center"
        style={hamburgerStyle}
      >
        <FiMenu className="w-5 h-5 text-white" />
      </button>

      {/* Sidebar */}
      <aside
        aria-hidden={!isOpen}
        className="fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out"
        style={sidebarStyle}
      >
        <div className="h-16 flex items-center px-4">
          
        </div>

        <nav className="px-2 mt-4">
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => scrollMainTo("current")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiSun className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Current</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollMainTo("trends")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiBarChart2 className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Trends</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollMainTo("monthly")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiCalendar className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Monthly</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollMainTo("map")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiMap className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Map</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollMainTo("hourly")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiClock className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Hourly Forecast</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollMainTo("details")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/6 transition-colors"
              >
                <FiFileText className="w-5 h-5 text-white/90" />
                <span className="text-white/90">Details</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto mb-6 px-4" />
      </aside>
    </>
  );
}
