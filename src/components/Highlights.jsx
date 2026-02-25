import { motion } from "framer-motion";

function Highlights({ data, unit = "C", theme = "dark", condition = "", isDay = 1, temp = 0 }) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full animate-pulse border border-white/20"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Today's Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl h-36"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  const feelsLike = unit === "C" ? Math.round(data.feelslike_c) : Math.round(data.feelslike_f);
  const humidity = data.humidity ?? 0;
  const pressure = data.pressure_mb ?? 0;
  const windSpeed = data.wind_kph ?? 0;
  const windDir = data.wind_dir ?? "N/A";
  const visibility = data.vis_km ?? 0;
  const uvIndex = data.uv ?? 0;

  // Match gradient with WeatherCard
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

  // Get UV severity
  const getUVSeverity = (uv) => {
    if (uv < 3) return { text: "Low", color: "from-green-400 to-green-500" };
    if (uv < 6) return { text: "Moderate", color: "from-yellow-400 to-yellow-500" };
    if (uv < 8) return { text: "High", color: "from-orange-400 to-orange-500" };
    return { text: "Very High", color: "from-red-400 to-red-500" };
  };

  const uvInfo = getUVSeverity(uvIndex);

  const stats = [
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <path d="M32 8C20 8 10 18 10 30C10 42 20 52 32 52C44 52 54 42 54 30C54 18 44 8 32 8Z" fill="url(#tempGrad)" stroke="#F59E0B" strokeWidth="2"/>
          <rect x="28" y="20" width="8" height="20" rx="2" fill="#DC2626"/>
          <circle cx="32" cy="44" r="6" fill="#DC2626"/>
          <defs>
            <linearGradient id="tempGrad" x1="32" y1="8" x2="32" y2="52">
              <stop offset="0%" stopColor="#FEF3C7"/>
              <stop offset="100%" stopColor="#FCA5A5"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "Feels Like", 
      value: `${feelsLike}°`, 
      unit: unit 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <path d="M32 10C32 10 20 20 20 32C20 38.6 25.4 44 32 44C38.6 44 44 38.6 44 32C44 20 32 10 32 10Z" fill="url(#humidGrad)"/>
          <defs>
            <linearGradient id="humidGrad" x1="32" y1="10" x2="32" y2="44">
              <stop offset="0%" stopColor="#60A5FA"/>
              <stop offset="100%" stopColor="#3B82F6"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "Humidity", 
      value: `${humidity}`, 
      unit: "%" 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="16" width="40" height="32" rx="4" fill="url(#pressGrad)" stroke="#8B5CF6" strokeWidth="2"/>
          <path d="M32 24L32 36M26 30L38 30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <defs>
            <linearGradient id="pressGrad" x1="32" y1="16" x2="32" y2="48">
              <stop offset="0%" stopColor="#C4B5FD"/>
              <stop offset="100%" stopColor="#8B5CF6"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "Pressure", 
      value: `${pressure}`, 
      unit: "hPa" 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <path d="M10 32C10 32 18 20 32 20C46 20 54 32 54 32C54 32 46 44 32 44C18 44 10 32 10 32Z" fill="url(#windGrad)"/>
          <path d="M12 32L20 28L28 32L36 28L44 32L52 28" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="windGrad" x1="32" y1="20" x2="32" y2="44">
              <stop offset="0%" stopColor="#A5F3FC"/>
              <stop offset="100%" stopColor="#06B6D4"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "Wind", 
      value: `${windSpeed}`, 
      unit: "km/h", 
      desc: windDir 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="20" fill="url(#visGrad)" stroke="#6366F1" strokeWidth="2"/>
          <circle cx="32" cy="32" r="8" fill="#312E81"/>
          <circle cx="28" cy="28" r="3" fill="white"/>
          <defs>
            <linearGradient id="visGrad" x1="32" y1="12" x2="32" y2="52">
              <stop offset="0%" stopColor="#C7D2FE"/>
              <stop offset="100%" stopColor="#818CF8"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "Visibility", 
      value: `${visibility}`, 
      unit: "km" 
    },
    { 
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="16" fill="url(#uvGrad)"/>
          <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M32 8V16M32 48V56M56 32H48M16 32H8"/>
            <path d="M48 16L44 20M20 44L16 48M48 48L44 44M20 20L16 16"/>
          </g>
          <defs>
            <linearGradient id="uvGrad" x1="32" y1="16" x2="32" y2="48">
              <stop offset="0%" stopColor="#FEF08A"/>
              <stop offset="100%" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
      ), 
      label: "UV Index", 
      value: `${uvIndex}`, 
      severity: uvInfo.text,
      severityColor: uvInfo.color
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white drop-shadow-lg">
          Today's Highlights
        </h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-5 flex flex-col items-center text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Icon */}
              <motion.div 
                className="mb-3"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Label */}
              <p className="text-sm sm:text-base text-white/80 font-medium mb-2">
                {stat.label}
              </p>
              
              {/* Value */}
              <div className="flex items-baseline gap-1">
                <p className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                  {stat.value}
                </p>
                {stat.unit && (
                  <span className="text-lg sm:text-xl text-white/90 font-medium">
                    {stat.unit}
                  </span>
                )}
              </div>
              
              {/* Description or Severity */}
              {stat.desc && (
                <p className="text-xs sm:text-sm text-white/70 mt-2 font-semibold uppercase tracking-wide">
                  {stat.desc}
                </p>
              )}
              
              {stat.severity && (
                <div className={`mt-2 px-3 py-1 rounded-full bg-gradient-to-r ${stat.severityColor} text-white text-xs font-bold shadow-md`}>
                  {stat.severity}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Highlights;