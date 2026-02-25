import { motion } from "framer-motion";
import { SunIcon, CloudIcon, BoltIcon, MoonIcon } from "@heroicons/react/24/solid";

function WeatherCard({ data, unit = "C", theme = "dark" }) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-md p-6 rounded-3xl shadow-lg text-center max-w-sm mx-auto animate-pulse text-white"
      >
        Loading weather...
      </motion.div>
    );
  }

  const city = data.city || "Unknown City";
  const region = data.region || "";
  const country = data.country || "Unknown Country";
  const icon = data.icon || null;
  const condition = data.condition || "N/A";
  const isDay = data.is_day !== undefined ? data.is_day : 1; // 1 for day, 0 for night

  // Safely handle temperatures
  const temp =
    unit === "C"
      ? data.temp_c !== undefined
        ? Math.round(data.temp_c)
        : 0
      : data.temp_f !== undefined
      ? Math.round(data.temp_f)
      : 0;

  const feelsLike =
    unit === "C"
      ? data.feelslike_c !== undefined
        ? Math.round(data.feelslike_c)
        : 0
      : data.feelslike_f !== undefined
      ? Math.round(data.feelslike_f)
      : 0;

  const maxTemp =
    unit === "C"
      ? data.max_temp_c !== undefined
        ? Math.round(data.max_temp_c)
        : temp + 3
      : data.max_temp_f !== undefined
      ? Math.round(data.max_temp_f)
      : temp + 5;

  const minTemp =
    unit === "C"
      ? data.min_temp_c !== undefined
        ? Math.round(data.min_temp_c)
        : temp - 3
      : data.min_temp_f !== undefined
      ? Math.round(data.min_temp_f)
      : temp - 5;

  // Get current time
  const currentTime = new Date().toLocaleTimeString([], { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true });

  // USE REAL HOURLY FORECAST DATA from your API
  // Replace this with actual hourly data from your weather API response
  const hourlyForecast = data.hourly || [
    { time: "NOW", temp: temp, condition: condition, icon: icon, is_day: isDay },
    { time: "9pm", temp: temp - 1, condition: "Partly cloudy", icon: null, is_day: 0 },
    { time: "10pm", temp: temp - 2, condition: "Cloudy", icon: null, is_day: 0 },
    { time: "11pm", temp: temp - 2, condition: "Cloudy", icon: null, is_day: 0 },
    { time: "12am", temp: temp - 3, condition: "Cloudy", icon: null, is_day: 0 },
    
  ];

  // Determine gradient based on actual condition and time of day
  let gradientClass = "from-blue-400 via-blue-500 to-indigo-600";
  let backgroundImage = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=800&fit=crop";
  
  const cond = condition.toLowerCase();
  
  // Night conditions
  if (isDay === 0) {
    if (cond.includes("clear")) {
      gradientClass = "from-indigo-900 via-blue-900 to-slate-900";
      backgroundImage = "https://images.unsplash.com/photo-1532978379173-c4e2e3b9f862?w=400&h=800&fit=crop";
    } else if (cond.includes("cloud")) {
      gradientClass = "from-slate-700 via-slate-800 to-blue-900";
      backgroundImage = "https://images.unsplash.com/photo-1532978379173-c4e2e3b9f862?w=400&h=800&fit=crop";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      gradientClass = "from-slate-600 via-blue-800 to-indigo-900";
      backgroundImage = "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&h=800&fit=crop";
    }
  } else {
    // Day conditions
    if (cond.includes("storm") || cond.includes("thunder")) {
      gradientClass = "from-slate-500 via-slate-600 to-slate-800";
      backgroundImage = "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&h=800&fit=crop";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      gradientClass = "from-blue-400 via-blue-500 to-indigo-600";
      backgroundImage = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=800&fit=crop";
    } else if (cond.includes("clear") || cond.includes("sunny")) {
      if (temp >= 25) {
        gradientClass = "from-orange-400 via-pink-500 to-red-500";
        backgroundImage = "https://images.unsplash.com/photo-1601297183033-e2460d68f47f?w=400&h=800&fit=crop";
      } else {
        gradientClass = "from-cyan-300 via-blue-400 to-blue-500";
        backgroundImage = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=800&fit=crop";
      }
    } else if (cond.includes("cloud") || cond.includes("overcast")) {
      gradientClass = "from-gray-400 via-slate-500 to-blue-500";
      backgroundImage = "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=800&fit=crop";
    } else if (cond.includes("snow") || cond.includes("blizzard")) {
      gradientClass = "from-slate-300 via-blue-300 to-indigo-400";
      backgroundImage = "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=800&fit=crop";
    } else if (cond.includes("mist") || cond.includes("fog")) {
      gradientClass = "from-gray-300 via-gray-400 to-slate-500";
      backgroundImage = "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400&h=800&fit=crop";
    }
  }

  // Get appropriate weather icon based on ACTUAL condition and time
  const getWeatherIcon = (conditionText, isDayTime) => {
    const cond = conditionText.toLowerCase();
    
    if (cond.includes("thunder") || cond.includes("storm")) {
      return <BoltIcon className="w-28 h-28 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)]" />;
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      return (
        <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]" viewBox="0 0 64 64" fill="none">
          <path d="M48 28C52 28 56 24 56 20C56 16 52 12 48 12C48 6 43 0 36 0C30 0 25 4 24 9C21 9 18 12 18 16C14 16 10 20 10 24C10 28 14 32 18 32H48Z" fill="url(#rainCloudGradient)" transform="translate(0, 8)"/>
          <defs>
            <linearGradient id="rainCloudGradient" x1="32" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <path d="M24 42L24 50M32 44L32 52M40 42L40 50" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    } else if (cond.includes("clear") || cond.includes("sunny")) {
      if (isDayTime === 0) {
        // Moon for night clear
        return (
          <svg className="w-28 h-28 drop-shadow-[0_0_25px_rgba(226,232,240,0.7)]" viewBox="0 0 64 64" fill="none">
            <path d="M40 8C24 8 12 20 12 36C12 52 24 64 40 64C56 64 64 52 64 36C64 34 60 32 58 32C50 32 44 26 44 18C44 16 42 8 40 8Z" fill="url(#moonGradient)"/>
            <defs>
              <linearGradient id="moonGradient" x1="38" y1="8" x2="38" y2="64">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
          </svg>
        );
      } else {
        // Sun for day clear
        return (
          <svg className="w-28 h-28 drop-shadow-[0_0_25px_rgba(251,191,36,0.7)]" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="12" fill="url(#sunGradient)"/>
            <g stroke="url(#sunRaysGradient)" strokeWidth="3" strokeLinecap="round">
              <path d="M32 8V14M32 50V56M56 32H50M14 32H8M48 16L44 20M20 44L16 48M48 48L44 44M20 20L16 16"/>
            </g>
            <defs>
              <linearGradient id="sunGradient" x1="32" y1="20" x2="32" y2="44">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <linearGradient id="sunRaysGradient" x1="32" y1="8" x2="32" y2="56">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        );
      }
    } else if (cond.includes("partly cloudy") || cond.includes("partly")) {
      if (isDayTime === 0) {
        // Moon with clouds for night partly cloudy
        return (
          <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" viewBox="0 0 64 64" fill="none">
            <path d="M34 12C22 12 14 20 14 28C14 36 22 44 34 44C40 44 44 40 44 34C44 33 42 32 40 32C36 32 33 29 33 25C33 24 33 12 34 12Z" fill="url(#moonCloudGradient)" transform="translate(4, -4)"/>
            <path d="M44 32C47 32 50 29 50 26C50 23 47 20 44 20C44 16 41 12 37 12C34 12 31 14 30 17C28 17 26 19 26 22C23 22 20 25 20 28C20 31 23 34 26 34H44Z" fill="url(#cloudMoonGradient)" transform="translate(-4, 8)"/>
            <defs>
              <linearGradient id="moonCloudGradient" x1="29" y1="12" x2="29" y2="44">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <linearGradient id="cloudMoonGradient" x1="32" y1="20" x2="32" y2="34">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
          </svg>
        );
      } else {
        // Sun with clouds for day partly cloudy
        return (
          <svg className="w-28 h-28 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" viewBox="0 0 64 64" fill="none">
            <circle cx="24" cy="20" r="8" fill="url(#partlySunGradient)"/>
            <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.8">
              <path d="M24 6V10M24 30V34M38 20H34M14 20H10M34 10L32 12M16 28L14 30M34 30L32 28M16 12L14 10"/>
            </g>
            <path d="M44 32C47 32 50 29 50 26C50 23 47 20 44 20C44 16 41 12 37 12C34 12 31 14 30 17C28 17 26 19 26 22C23 22 20 25 20 28C20 31 23 34 26 34H44Z" fill="url(#partlyCloudGradient)" transform="translate(0, 12)"/>
            <defs>
              <linearGradient id="partlySunGradient" x1="24" y1="12" x2="24" y2="28">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <linearGradient id="partlyCloudGradient" x1="32" y1="12" x2="32" y2="34">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
          </svg>
        );
      }
    } else if (cond.includes("cloud") || cond.includes("overcast")) {
      return (
        <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(226,232,240,0.5)]" viewBox="0 0 64 64" fill="none">
          <path d="M48 36C52 36 56 32 56 28C56 24 52 20 48 20C48 14 43 8 36 8C30 8 25 12 24 17C21 17 18 20 18 24C14 24 10 28 10 32C10 36 14 40 18 40H48Z" fill="url(#cloudGradient)"/>
          <defs>
            <linearGradient id="cloudGradient" x1="32" y1="8" x2="32" y2="40">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
        </svg>
      );
    } else if (cond.includes("snow")) {
      return (
        <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(226,232,240,0.7)]" viewBox="0 0 64 64" fill="none">
          <path d="M48 32C52 32 56 28 56 24C56 20 52 16 48 16C48 10 43 4 36 4C30 4 25 8 24 13C21 13 18 16 18 20C14 20 10 24 10 28C10 32 14 36 18 36H48Z" fill="url(#snowCloudGradient)"/>
          <defs>
            <linearGradient id="snowCloudGradient" x1="32" y1="4" x2="32" y2="36">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <g fill="#E0F2FE">
            <circle cx="20" cy="44" r="2"/>
            <circle cx="28" cy="48" r="2"/>
            <circle cx="36" cy="46" r="2"/>
            <circle cx="44" cy="50" r="2"/>
            <circle cx="24" cy="54" r="2"/>
            <circle cx="40" cy="56" r="2"/>
          </g>
        </svg>
      );
    } else if (cond.includes("mist") || cond.includes("fog")) {
      return (
        <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" viewBox="0 0 64 64" fill="none">
          <g opacity="0.8">
            <rect x="12" y="20" width="40" height="3" rx="1.5" fill="#CBD5E1"/>
            <rect x="8" y="28" width="48" height="3" rx="1.5" fill="#94A3B8"/>
            <rect x="12" y="36" width="40" height="3" rx="1.5" fill="#CBD5E1"/>
            <rect x="10" y="44" width="44" height="3" rx="1.5" fill="#94A3B8"/>
          </g>
        </svg>
      );
    } else {
      return <CloudIcon className="w-28 h-28 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />;
    }
  };

  // Get small hourly icon
  const getSmallWeatherIcon = (hourData) => {
    if (hourData.icon) {
      return <img src={hourData.icon} alt={hourData.condition} className="w-10 h-10" />;
    }
    
    const cond = (hourData.condition || "").toLowerCase();
    const isDayTime = hourData.is_day;
    
    if (cond.includes("clear") || cond.includes("sunny")) {
      if (isDayTime === 0) {
        return <span className="text-3xl">🌙</span>;
      } else {
        return <span className="text-3xl">☀️</span>;
      }
    } else if (cond.includes("partly")) {
      if (isDayTime === 0) {
        return <span className="text-3xl">☁️</span>;
      } else {
        return <span className="text-3xl">⛅</span>;
      }
    } else if (cond.includes("cloud")) {
      return <span className="text-3xl">☁️</span>;
    } else if (cond.includes("rain")) {
      return <span className="text-3xl">🌧️</span>;
    } else if (cond.includes("storm") || cond.includes("thunder")) {
      return <span className="text-3xl">⛈️</span>;
    } else if (cond.includes("snow")) {
      return <span className="text-3xl">❄️</span>;
    } else {
      return <span className="text-3xl">☁️</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-sm mx-auto h-[600px] rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-85`}></div>
        
        {/* Additional blur overlay for better text readability */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col text-white p-6">
        {/* Header - City and Time (Centered) */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold tracking-wide mb-1">{city}</h2>
          <p className="text-sm opacity-90">{currentTime}</p>
        </div>

        {/* Main Temperature Section */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-12">
          {/* Weather Icon - Using ACTUAL condition and time */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            {getWeatherIcon(condition, isDay)}
          </motion.div>

          {/* Condition Text */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-light mb-6"
          >
            {condition}
          </motion.p>

          {/* Large Temperature with Unit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex items-start mb-6"
          >
            <span className="text-[140px] font-thin leading-none tracking-tighter">
              {temp}
            </span>
            <div className="flex flex-col items-start mt-4">
              <span className="text-5xl font-light">°</span>
              <span className="text-3xl font-light -mt-2">{unit}</span>
            </div>
          </motion.div>

          {/* High/Low Temperatures */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 text-xl"
          >
            <span>{maxTemp}°{unit}</span>
            <div className="w-px h-6 bg-white/50"></div>
            <span>{minTemp}°{unit}</span>
          </motion.div>
        </div>

        {/* Hourly Forecast Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-auto"
        >
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex justify-between items-end gap-2">
              {hourlyForecast.map((hour, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (idx * 0.05) }}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  {/* Temperature value */}
                  <span className="text-sm font-semibold">{hour.temp}°</span>
                  
                  {/* Weather icon - using actual hourly data */}
                  {getSmallWeatherIcon(hour)}
                  
                  {/* Time label */}
                  <span className="text-xs opacity-80 font-medium whitespace-nowrap">{hour.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default WeatherCard;