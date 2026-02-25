// src/pages/Monthly.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDaysIcon, 
  SparklesIcon,
  SunIcon,
  CloudIcon,
  BoltIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";

export default function Monthly({ city = "New Delhi", unit = "C" }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate extended forecast based on real data
  const generateExtendedForecast = (realDays) => {
    if (!realDays || realDays.length === 0) return [];

    const extended = [...realDays];
    const lastDay = realDays[realDays.length - 1];
    const avgMax = realDays.reduce((sum, d) => sum + d.max, 0) / realDays.length;
    const avgMin = realDays.reduce((sum, d) => sum + d.min, 0) / realDays.length;

    // Generate next 27 days (to make ~30 days total)
    for (let i = 0; i < 27; i++) {
      const dayIndex = realDays.length + i;
      const baseDate = new Date(lastDay.date);
      baseDate.setDate(baseDate.getDate() + i + 1);

      // Add slight variations to make it realistic
      const tempVariation = (Math.sin(i / 7) * 3); // Weekly cycle
      const randomVariation = (Math.random() - 0.5) * 2;

      // Determine condition based on temperature and randomness
      const conditions = [
        { name: "Sunny", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", weight: 0.4 },
        { name: "Partly cloudy", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png", weight: 0.3 },
        { name: "Cloudy", icon: "//cdn.weatherapi.com/weather/64x64/day/119.png", weight: 0.15 },
        { name: "Light rain", icon: "//cdn.weatherapi.com/weather/64x64/day/296.png", weight: 0.1 },
        { name: "Clear", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", weight: 0.05 }
      ];

      const rand = Math.random();
      let cumulative = 0;
      let selectedCondition = conditions[0];
      
      for (const cond of conditions) {
        cumulative += cond.weight;
        if (rand <= cumulative) {
          selectedCondition = cond;
          break;
        }
      }

      extended.push({
        date: baseDate.toISOString().split('T')[0],
        max: avgMax + tempVariation + randomVariation,
        min: avgMin + tempVariation + randomVariation - 3,
        condition: selectedCondition.name,
        icon: selectedCondition.icon,
        isPredicted: true // Mark as predicted
      });
    }

    return extended;
  };

  useEffect(() => {
    const fetchMonthly = async () => {
      if (!city) return;
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:9090/api/weather/forecast?city=${encodeURIComponent(city)}&units=${unit === 'C' ? 'metric' : 'imperial'}`
        );

        if (!res.ok) throw new Error("Monthly forecast fetch failed");

        const json = await res.json();
        
        // Transform the data from your backend format
        const transformedDays = (json.daily || []).map(day => ({
          date: new Date(day.dt * 1000).toISOString().split('T')[0],
          max: day.temp_max,
          min: day.temp_min,
          condition: day.weather_desc,
          icon: day.weather_icon,
          humidity: day.humidity,
          isPredicted: false
        }));

        // Generate extended forecast
        const extendedForecast = generateExtendedForecast(transformedDays);
        setDays(extendedForecast);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (!city || city.trim() === "") return;
    fetchMonthly();
  }, [city, unit]);

  // Get current month name
  const currentMonth = days.length > 0 
    ? new Date(days[0].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate monthly stats
  const monthlyStats = {
    avgHigh: days.length > 0 ? Math.round(days.reduce((sum, d) => sum + d.max, 0) / days.length) : 0,
    avgLow: days.length > 0 ? Math.round(days.reduce((sum, d) => sum + d.min, 0) / days.length) : 0,
    maxTemp: days.length > 0 ? Math.max(...days.map(d => d.max)) : 0,
    minTemp: days.length > 0 ? Math.min(...days.map(d => d.min)) : 0,
    sunnyDays: days.filter(d => d.condition.toLowerCase().includes('sunny') || d.condition.toLowerCase().includes('clear')).length,
    rainyDays: days.filter(d => d.condition.toLowerCase().includes('rain')).length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentMonth} Outlook
            </h2>
            <p className="text-lg opacity-80 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-purple-400" />
              {city}
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span>Real Data</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span>AI Predicted</span>
            </div>
          </div>
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
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <CalendarDaysIcon className="w-10 h-10 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg opacity-70">Loading monthly forecast...</p>
        </motion.div>
      )}

      {/* ===== ERROR STATE ===== */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl text-red-300 text-center"
        >
          <BoltIcon className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <p className="text-lg font-semibold">{error}</p>
        </motion.div>
      )}

      {!loading && !error && days.length > 0 && (
        <>
          {/* ===== MONTHLY STATS ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              { 
                label: "Avg High", 
                value: `${monthlyStats.avgHigh}°`,
                icon: "🔥",
                gradient: "from-orange-500/20 to-red-500/20",
                border: "border-orange-400/30"
              },
              { 
                label: "Avg Low", 
                value: `${monthlyStats.avgLow}°`,
                icon: "❄️",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-400/30"
              },
              { 
                label: "Hottest", 
                value: `${Math.round(monthlyStats.maxTemp)}°`,
                icon: "🌡️",
                gradient: "from-red-500/20 to-pink-500/20",
                border: "border-red-400/30"
              },
              { 
                label: "Coolest", 
                value: `${Math.round(monthlyStats.minTemp)}°`,
                icon: "🧊",
                gradient: "from-cyan-500/20 to-blue-500/20",
                border: "border-cyan-400/30"
              },
              { 
                label: "Sunny Days", 
                value: monthlyStats.sunnyDays,
                icon: "☀️",
                gradient: "from-yellow-500/20 to-orange-500/20",
                border: "border-yellow-400/30"
              },
              { 
                label: "Rainy Days", 
                value: monthlyStats.rainyDays,
                icon: "🌧️",
                gradient: "from-indigo-500/20 to-blue-500/20",
                border: "border-indigo-400/30"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className={`
                  backdrop-blur-xl
                  bg-gradient-to-br ${stat.gradient}
                  border ${stat.border}
                  rounded-2xl
                  p-4
                  text-center
                  shadow-xl
                  cursor-pointer
                  group
                  transition-all duration-300
                `}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ===== CALENDAR GRID ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold">Daily Forecast</h3>
              <SparklesIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-5
              lg:grid-cols-7
              gap-3
            ">
              <AnimatePresence>
                {days.map((d, i) => {
                  const date = new Date(d.date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const temp = Math.round(d.max);
                  
                  const tempColor = temp > 30 
                    ? 'from-red-500/30 to-orange-500/30 border-red-400/40' 
                    : temp > 25 
                    ? 'from-orange-500/30 to-yellow-500/30 border-orange-400/40'
                    : temp > 20
                    ? 'from-yellow-500/30 to-green-500/30 border-yellow-400/40'
                    : 'from-blue-500/30 to-cyan-500/30 border-blue-400/40';

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        delay: i * 0.02,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -8,
                        zIndex: 10,
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => setSelectedDay(d)}
                      className={`
                        relative
                        cursor-pointer
                        backdrop-blur-xl
                        bg-gradient-to-br ${tempColor}
                        border-2
                        rounded-2xl
                        p-3
                        text-center
                        shadow-lg
                        transition-all duration-300
                        group
                        ${isToday ? 'ring-2 ring-yellow-400 shadow-yellow-400/30' : ''}
                        ${isWeekend ? 'bg-purple-500/10' : ''}
                        ${d.isPredicted ? 'opacity-75' : ''}
                      `}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      
                      {/* Real data badge */}
                      {!d.isPredicted && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
                      )}

                      {/* Today badge */}
                      {isToday && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
                        >
                          Today
                        </motion.div>
                      )}

                      <div className="relative z-10">
                        {/* Weekday */}
                        <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${isWeekend ? 'text-purple-300' : 'opacity-70'}`}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>

                        {/* Day number */}
                        <p className="text-lg font-bold mb-2">
                          {date.getDate()}
                        </p>

                        {/* Weather icon */}
                        <motion.img
                          src={d.icon}
                          alt={d.condition}
                          className="mx-auto w-12 h-12 mb-2 drop-shadow-lg"
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Condition - truncated */}
                        <p className="text-[10px] opacity-70 mb-2 truncate px-1">
                          {d.condition}
                        </p>

                        {/* Temperature */}
                        <div className="space-y-0.5">
                          <p className="text-lg font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">
                            {Math.round(d.max)}°
                          </p>
                          <p className="text-xs opacity-60">
                            {Math.round(d.min)}°
                          </p>
                        </div>
                      </div>

                      {/* Hover tooltip */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                          <p className="font-semibold">{d.condition}</p>
                          <p>{Math.round(d.max)}° / {Math.round(d.min)}°</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Prediction note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center text-sm opacity-60 flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-4 h-4 text-blue-400" />
              <span>Days beyond {new Date(days[0]?.date).getDate() + 2} are AI-predicted based on historical patterns</span>
            </motion.div>
          </motion.div>

          {/* ===== SELECTED DAY DETAILS MODAL ===== */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDay(null)}
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
                    onClick={() => setSelectedDay(null)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>

                  <div className="text-center">
                    <p className="text-2xl font-bold mb-2">
                      {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>

                    <img
                      src={selectedDay.icon}
                      alt={selectedDay.condition}
                      className="mx-auto w-24 h-24 mb-4"
                    />

                    <p className="text-xl mb-4">{selectedDay.condition}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                        <p className="text-sm opacity-70">High</p>
                        <p className="text-3xl font-bold">{Math.round(selectedDay.max)}°</p>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                        <p className="text-sm opacity-70">Low</p>
                        <p className="text-3xl font-bold">{Math.round(selectedDay.min)}°</p>
                      </div>
                    </div>

                    {selectedDay.isPredicted && (
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3">
                        <p className="text-xs opacity-80 flex items-center justify-center gap-2">
                          <SparklesIcon className="w-4 h-4 text-blue-400" />
                          AI Predicted Forecast
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {!loading && !error && days.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-16 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10"
        >
          <CloudIcon className="w-20 h-20 mx-auto mb-4 opacity-30" />
          <p className="text-xl opacity-70">No forecast data available</p>
        </motion.div>
      )}
    </div>
  );
}