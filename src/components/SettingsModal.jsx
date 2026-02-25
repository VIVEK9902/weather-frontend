import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

function SettingsModal({ isOpen, onClose, theme, setTheme, unit, setUnit, onClearPrefs }) {
  // Disable scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Responsive animation: bottom sheet on mobile, centered modal on desktop
  const isMobile = window.innerWidth < 640;

  const modalVariants = {
    hidden: { opacity: 0, y: isMobile ? "100%" : -50, scale: isMobile ? 1 : 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: isMobile ? "100%" : 50, scale: isMobile ? 1 : 0.8 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className={`relative w-full sm:w-96 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle for mobile */}
            {isMobile && (
              <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4" />
            )}

            {/* Close button for desktop */}
            {!isMobile && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-500/20 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}

            <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">
              ⚙️ Settings
            </h2>

            {/* Unit toggle */}
            <div className="flex justify-between items-center mb-4">
              <span>Temperature Unit</span>
              <button
                onClick={() => setUnit(unit === "C" ? "F" : "C")}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
              >
                °{unit}
              </button>
            </div>

            {/* Theme toggle */}
            <div className="flex justify-between items-center mb-4">
              <span>Theme</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
              </button>
            </div>

            {/* Clear Preferences */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClearPrefs}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold"
              >
                Clear Preferences
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;
