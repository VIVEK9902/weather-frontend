// src/pages/Hourly.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrendChart from "../components/TrendChart";
import { 
  ClockIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/solid";

export default function Hourly({ city = "New Delhi", unit = "C" }) {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("day");

  useEffect(() => {
    const fetchHourly = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(
          `http://localhost:9090/api/weather/forecast?city=${encodeURIComponent(city)}&units=${unit === 'C' ? 'metric' : 'imperial'}`
        );
        
        if (!res.ok) throw new Error("Hourly forecast fetch failed");
        
        const json = await res.json();
        
        // Since your API returns daily data, let's generate hourly predictions
        // In a real scenario, you'd have an hourly endpoint
        const generatedHourly = generateHourlyData(json.daily || []);
        setHourly(generatedHourly);
        
        // Determine time of day based on current hour
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 12) setTimeOfDay("morning");
        else if (currentHour >= 12 && currentHour < 18) setTimeOfDay("afternoon");
        else if (currentHour >= 18 && currentHour < 21) setTimeOfDay("evening");
        else setTimeOfDay("night");
        
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (!city || city.trim() === "") return;
    fetchHourly();
  }, [city, unit]);

  // Generate realistic hourly data from daily forecast
  const generateHourlyData = (dailyData) => {
    if (!dailyData || dailyData.length === 0) return [];
    
    const today = dailyData[0];
    const hourlyArr = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      
      // Temperature curve (realistic daily pattern)
      const hourProgress = hour / 24;
      const tempRange = today.temp_max - today.temp_min;
      const tempCurve = Math.sin((hourProgress - 0.25) * 2 * Math.PI);
      const temp = today.temp_min + (tempRange * (tempCurve + 1) / 2);
      
      // Feels like (slightly different)
      const feelsLike = temp + (Math.random() - 0.5) * 2;
      
      // Humidity (higher at night, lower during day)
      const humidityBase = today.humidity || 60;
      const humidity = humidityBase + (hour < 6 || hour > 18 ? 10 : -10) + (Math.random() - 0.5) * 10;
      
      // Wind (variable)
      const wind = (today.wind_speed || 10) + (Math.random() - 0.5) * 5;
      
      // Rain probability (lower during day)
      const rain = hour >= 6 && hour <= 18 ? Math.random() * 20 : Math.random() * 30;
      
      // Weather condition based on time
      const isDaytime = hour >= 6 && hour <= 18;
      let icon = today.weather_icon;
      let condition = today.weather_desc;
      
      if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
        icon = isDaytime 
          ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
          : "//cdn.weatherapi.com/weather/64x64/night/113.png";
      } else if (condition.toLowerCase().includes('cloud')) {
        icon = isDaytime
          ? "//cdn.weatherapi.com/weather/64x64/day/119.png"
          : "//cdn.weatherapi.com/weather/64x64/night/119.png";
      }
      
      hourlyArr.push({
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp,
        feelsLike,
        humidity: Math.max(0, Math.min(100, humidity)),
        wind: Math.max(0, wind),
        rain: Math.max(0, Math.min(100, rain)),
        icon,
        condition,
        hour,
        isDaytime
      });
    }
    
    return hourlyArr;
  };

  const hours = hourly.slice(0, 24);

  const tempSeries = [
    {
      name: `Temperature (°${unit})`,
      data: hours.map(h => Math.round(h.temp))
    }
  ];

  const categories = hours.map(h => h.time);

  /* ========= Summary stats ========= */
  const stats = {
    maxTemp: hours.length > 0 ? Math.max(...hours.map(h => h.temp)) : 0,
    minTemp: hours.length > 0 ? Math.min(...hours.map(h => h.temp)) : 0,
    avgHumidity: hours.length > 0 
      ? Math.round(hours.reduce((a, b) => a + b.humidity, 0) / hours.length)
      : 0,
    maxWind: hours.length > 0 ? Math.max(...hours.map(h => h.wind)) : 0,
    tempRange: 0
  };
  stats.tempRange = stats.maxTemp - stats.minTemp;

  // Find peak temperature hour
  const peakTempHour = hours.length > 0 
    ? hours.reduce((max, h) => h.temp > max.temp ? h : max, hours[0])
    : null;

  // Determine background gradient based on time of day
  const getTimeGradient = () => {
    switch(timeOfDay) {
      case "morning":
        return "from-orange-400/20 via-yellow-400/20 to-blue-400/20";
      case "afternoon":
        return "from-yellow-400/20 via-orange-400/20 to-red-400/20";
      case "evening":
        return "from-orange-500/20 via-purple-500/20 to-indigo-600/20";
      case "night":
        return "from-indigo-900/30 via-purple-900/30 to-blue-900/30";
      default:
        return "from-blue-400/20 via-cyan-400/20 to-teal-400/20";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${getTimeGradient()} blur-3xl -z-10 animate-pulse`} />
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              24-Hour Forecast
            </h2>
            <p className="text-lg opacity-80 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-400" />
              {city} · {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
            </p>
          </div>

          {/* Current time badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg"
          >
            <div className="flex items-center gap-3">
              {timeOfDay === "night" ? (
                <MoonIcon className="w-6 h-6 text-blue-300 animate-pulse" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400 animate-pulse" />
              )}
              <div>
                <p className="text-xs opacity-70">Local Time</p>
                <p className="text-lg font-bold">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-16"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <ClockIcon className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg opacity-70">Loading hourly forecast...</p>
        </motion.div>
      )}

      {/* ===== ERROR STATE ===== */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl text-red-300 text-center"
        >
          <p className="text-lg font-semibold">{error}</p>
        </motion.div>
      )}

      {!loading && !error && hours.length > 0 && (
        <>
          {/* ===== TEMPERATURE CHART ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              relative overflow-hidden
              backdrop-blur-2xl
              bg-gradient-to-br from-white/10 via-white/5 to-transparent
              border border-white/20
              rounded-3xl
              shadow-2xl
              p-6
              group
            "
          >
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getTimeGradient()} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Temperature Trend</h3>
                </div>
                
                {peakTempHour && (
                  <div className="text-right">
                    <p className="text-xs opacity-60">Peak Temperature</p>
                    <p className="text-sm font-semibold">{peakTempHour.time} · {Math.round(peakTempHour.temp)}°</p>
                  </div>
                )}
              </div>

              <TrendChart
                series={tempSeries}
                categories={categories}
                height={280}
                condition={hours[0]?.condition}
              />
            </div>
          </motion.div>

          {/* ===== STATS GRID ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { 
                label: "High", 
                value: `${Math.round(stats.maxTemp)}°`,
                icon: "🔥",
                gradient: "from-red-500/20 to-orange-500/20",
                border: "border-red-400/30",
                detail: "Today's peak"
              },
              { 
                label: "Low", 
                value: `${Math.round(stats.minTemp)}°`,
                icon: "❄️",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-400/30",
                detail: "Overnight low"
              },
              { 
                label: "Humidity", 
                value: `${stats.avgHumidity}%`,
                icon: "💧",
                gradient: "from-cyan-500/20 to-blue-500/20",
                border: "border-cyan-400/30",
                detail: "Average"
              },
              { 
                label: "Wind", 
                value: `${Math.round(stats.maxWind)} ${unit === 'C' ? 'km/h' : 'mph'}`,
                icon: "🌬️",
                gradient: "from-teal-500/20 to-green-500/20",
                border: "border-teal-400/30",
                detail: "Max speed"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`
                  relative overflow-hidden
                  backdrop-blur-xl
                  bg-gradient-to-br ${stat.gradient}
                  border ${stat.border}
                  rounded-2xl
                  shadow-xl
                  p-5
                  text-center
                  transition-all duration-300
                  cursor-pointer
                  group
                `}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs opacity-70">{stat.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ===== HOURLY CARDS CAROUSEL ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              backdrop-blur-2xl
              bg-gradient-to-br from-white/5 via-white/5 to-transparent
              border border-white/20
              rounded-3xl
              shadow-2xl
              p-6
              overflow-hidden
            "
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <ClockIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold">Hour by Hour</h3>
              <SparklesIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>

            {/* Horizontal scroll container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {hours.map((h, i) => {
                const isNow = i === 0;
                const temp = Math.round(h.temp);
                
                // Color based on temperature
                const tempColor = temp > 30 
                  ? 'from-red-500/30 to-orange-500/30 border-red-400/40' 
                  : temp > 25 
                  ? 'from-orange-500/30 to-yellow-500/30 border-orange-400/40'
                  : temp > 20
                  ? 'from-yellow-500/30 to-green-500/30 border-yellow-400/40'
                  : temp > 15
                  ? 'from-blue-500/30 to-cyan-500/30 border-blue-400/40'
                  : 'from-cyan-500/30 to-blue-600/30 border-cyan-400/40';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ 
                      scale: 1.08, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => setSelectedHour(h)}
                    className={`
                      relative
                      min-w-[140px]
                      cursor-pointer
                      backdrop-blur-xl
                      bg-gradient-to-br ${tempColor}
                      border-2
                      rounded-2xl
                      p-4
                      text-center
                      shadow-xl
                      transition-all duration-300
                      group
                      ${isNow ? 'ring-2 ring-yellow-400 shadow-yellow-400/30' : ''}
                      ${!h.isDaytime ? 'bg-indigo-900/20' : ''}
                    `}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    
                    {/* Now badge */}
                    {isNow && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                      >
                        Now
                      </motion.div>
                    )}

                    <div className="relative z-10">
                      {/* Time with day/night indicator */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {h.isDaytime ? (
                          <SunIcon className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <MoonIcon className="w-4 h-4 text-blue-300" />
                        )}
                        <p className="text-sm font-bold">{h.time}</p>
                      </div>

                      {/* Weather icon */}
                      <motion.img
                        src={h.icon}
                        alt={h.condition}
                        className="mx-auto w-16 h-16 mb-3 drop-shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Temperature */}
                      <p className="text-2xl font-bold mb-1 bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">
                        {Math.round(h.temp)}°
                      </p>
                      <p className="text-xs opacity-70 mb-3">
                        Feels {Math.round(h.feelsLike)}°
                      </p>

                      {/* Details */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-center gap-2 bg-blue-500/10 rounded-lg py-1 px-2">
                          <span>💧</span>
                          <span className="font-medium">{Math.round(h.humidity)}%</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-green-500/10 rounded-lg py-1 px-2">
                          <span>🌬️</span>
                          <span className="font-medium">{Math.round(h.wind)} {unit === 'C' ? 'km/h' : 'mph'}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-indigo-500/10 rounded-lg py-1 px-2">
                          <span>🌧️</span>
                          <span className="font-medium">{Math.round(h.rain)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ===== INSIGHTS ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-blue-400" />
              24-Hour Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="opacity-80">
                <span className="font-semibold">Temperature Range:</span> {Math.round(stats.tempRange)}° variation today
              </div>
              <div className="opacity-80">
                <span className="font-semibold">Best Time:</span> {peakTempHour?.time} ({Math.round(peakTempHour?.temp)}°)
              </div>
              <div className="opacity-80">
                <span className="font-semibold">Conditions:</span> Mostly {hours[0]?.condition.toLowerCase()}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ===== SELECTED HOUR MODAL ===== */}
      <AnimatePresence>
        {selectedHour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHour(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="
                backdrop-blur-2xl
                bg-gradient-to-br from-white/20 via-white/10 to-transparent
                border border-white/30
                rounded-3xl
                shadow-2xl
                p-8
                max-w-md w-full
                relative
              "
            >
              <button
                onClick={() => setSelectedHour(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {selectedHour.isDaytime ? (
                    <SunIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-8 h-8 text-blue-300" />
                  )}
                  <p className="text-3xl font-bold">{selectedHour.time}</p>
                </div>

                <img
                  src={selectedHour.icon}
                  alt={selectedHour.condition}
                  className="mx-auto w-32 h-32 mb-4"
                />

                <p className="text-xl mb-6">{selectedHour.condition}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
                    <p className="text-sm opacity-70">Temperature</p>
                    <p className="text-3xl font-bold">{Math.round(selectedHour.temp)}°</p>
                  </div>
                  <div className="bg-pink-500/20 border border-pink-400/30 rounded-xl p-4">
                    <p className="text-sm opacity-70">Feels Like</p>
                    <p className="text-3xl font-bold">{Math.round(selectedHour.feelsLike)}°</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3">
                    <p className="opacity-70 mb-1">💧 Humidity</p>
                    <p className="font-semibold">{Math.round(selectedHour.humidity)}%</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-3">
                    <p className="opacity-70 mb-1">🌬️ Wind</p>
                    <p className="font-semibold">{Math.round(selectedHour.wind)} {unit === 'C' ? 'km/h' : 'mph'}</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-3">
                    <p className="opacity-70 mb-1">🌧️ Rain</p>
                    <p className="font-semibold">{Math.round(selectedHour.rain)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}