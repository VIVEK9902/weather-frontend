import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon, SunIcon, CloudIcon, MoonIcon } from "@heroicons/react/24/solid";

function Forecast({ data, unit = "C", theme = "dark", condition = "", isDay = 1, temp = 0 }) {
  if (!data || !Array.isArray(data.forecast)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full border border-white/20"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
          3-Day Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl h-56 animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Match gradient with WeatherCard and Highlights
  let gradientClass = "from-blue-400 via-blue-500 to-indigo-600";
  
  const cond = condition.toLowerCase();
  
  // Night conditions
  if (isDay === 0) {
    if (cond.includes("clear")) {
      gradientClass = "from-indigo-900 via-blue-900 to-slate-900";
    } else if (cond.includes("cloud")) {
      gradientClass = "from-slate-700 via-slate-800 to-blue-900";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      gradientClass = "from-slate-600 via-blue-800 to-indigo-900";
    }
  } else {
    // Day conditions
    if (cond.includes("storm") || cond.includes("thunder")) {
      gradientClass = "from-slate-500 via-slate-600 to-slate-800";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      gradientClass = "from-blue-400 via-blue-500 to-indigo-600";
    } else if (cond.includes("clear") || cond.includes("sunny")) {
      if (temp >= 25) {
        gradientClass = "from-orange-400 via-pink-500 to-red-500";
      } else {
        gradientClass = "from-cyan-300 via-blue-400 to-blue-500";
      }
    } else if (cond.includes("cloud") || cond.includes("overcast")) {
      gradientClass = "from-gray-400 via-slate-500 to-blue-500";
    } else if (cond.includes("snow") || cond.includes("blizzard")) {
      gradientClass = "from-slate-300 via-blue-300 to-indigo-400";
    } else if (cond.includes("mist") || cond.includes("fog")) {
      gradientClass = "from-gray-300 via-gray-400 to-slate-500";
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }} 
      className={`relative bg-gradient-to-br ${gradientClass} opacity-85 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full border border-white/20 overflow-hidden`}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white drop-shadow-lg">
          3-Day Forecast
        </h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {data.forecast.map((d, idx) => {
            const date = d.date ? new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "N/A";
            const dayName = d.date ? new Date(d.date).toLocaleDateString(undefined, { weekday: "long" }) : "N/A";
            const icon = d.icon || null;
            const condition = d.condition || "N/A";
            const avgTemp = unit === "C" ? Math.round(d.avg_temp_c) : Math.round(d.avg_temp_f);
            const maxTemp = unit === "C" ? Math.round(d.max_temp_c) : Math.round(d.max_temp_f);
            const minTemp = unit === "C" ? Math.round(d.min_temp_c) : Math.round(d.min_temp_f);

            return (
              <motion.div 
                key={idx}
                variants={item}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="bg-white/15 backdrop-blur-md p-6 rounded-2xl text-center flex flex-col items-center gap-3 shadow-xl border border-white/20 relative overflow-hidden group"
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 w-full">
                  {/* Day name */}
                  <motion.p 
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                    className="font-bold text-lg text-white"
                  >
                    {dayName}
                  </motion.p>
                  
                  {/* Date */}
                  <p className="text-xs sm:text-sm text-white/70 mb-3">
                    {date}
                  </p>

                  {/* Weather Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="my-3"
                  >
                    {icon ? (
                      <img 
                        src={icon} 
                        alt={condition} 
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto drop-shadow-lg" 
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <SunIcon className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </motion.div>

                  {/* Temperature */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">
                      {avgTemp}°
                    </p>
                    <p className="text-xs text-white/70 mt-1">
                      {unit === "C" ? "Celsius" : "Fahrenheit"}
                    </p>
                  </motion.div>

                  {/* Condition */}
                  <p className="text-sm sm:text-base mt-3 font-medium text-white/90">
                    {condition}
                  </p>

                  {/* Temperature Range */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/20">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-1.5"
                    >
                      <div className="p-1.5 bg-gradient-to-br from-red-400 to-orange-500 rounded-full shadow-md">
                        <ArrowUpIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-semibold text-white">
                        {maxTemp}°
                      </span>
                    </motion.div>
                    
                    <div className="w-px h-6 bg-white/40"></div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-1.5"
                    >
                      <div className="p-1.5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-md">
                        <ArrowDownIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-semibold text-white">
                        {minTemp}°
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Forecast;