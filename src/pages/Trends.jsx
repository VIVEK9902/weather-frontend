// src/pages/Trends.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TrendChart from "../components/TrendChart";
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  FireIcon,
  CloudIcon,
  SunIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

export default function Trends({ city = "New Delhi", unit = "C" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:9090/api/weather/forecast?city=${encodeURIComponent(city)}&units=${unit === 'C' ? 'metric' : 'imperial'}`
        );

        if (!res.ok) throw new Error("Forecast fetch failed");

        const json = await res.json();
        
        // Transform the data from your backend format
        const transformedDaily = (json.daily || []).map(day => ({
          date: new Date(day.dt * 1000).toISOString().split('T')[0],
          max: day.temp_max,
          min: day.temp_min,
          avg: day.temp_day,
          condition: day.weather_desc,
          icon: day.weather_icon,
          humidity: day.humidity,
          wind: day.wind_speed
        }));

        setDaily(transformedDaily);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to fetch forecast");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, unit]);

  const days = daily.slice(0, 7);

  const categories = days.map((d) =>
    new Date(d.date).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
    })
  );

  const maxSeries = {
    name: `Max Temp (°${unit})`,
    data: days.map((d) => Math.round(d.max)),
  };

  const minSeries = {
    name: `Min Temp (°${unit})`,
    data: days.map((d) => Math.round(d.min)),
  };

  const avgSeries = {
    name: `Avg Temp (°${unit})`,
    data: days.map((d) => Math.round(d.avg)),
  };

  // Calculate trends and insights
  const getTrend = () => {
    if (days.length < 2) return null;
    const firstMax = days[0].max;
    const lastMax = days[days.length - 1].max;
    const diff = lastMax - firstMax;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      value: Math.abs(diff).toFixed(1),
      percentage: ((diff / firstMax) * 100).toFixed(1)
    };
  };

  const trend = getTrend();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      {/* ===== HEADER WITH ANIMATED GRADIENT ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              7-Day Forecast
            </h2>
            <p className="text-lg opacity-80 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              {city}
            </p>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`
                px-6 py-3 rounded-2xl backdrop-blur-xl
                ${trend.direction === 'up' 
                  ? 'bg-orange-500/20 border border-orange-400/30' 
                  : trend.direction === 'down'
                  ? 'bg-blue-500/20 border border-blue-400/30'
                  : 'bg-gray-500/20 border border-gray-400/30'
                }
                shadow-lg
              `}
            >
              <div className="flex items-center gap-3">
                {trend.direction === 'up' ? (
                  <ArrowTrendingUpIcon className="w-6 h-6 text-orange-400" />
                ) : trend.direction === 'down' ? (
                  <ArrowTrendingDownIcon className="w-6 h-6 text-blue-400" />
                ) : (
                  <CloudIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="text-xs opacity-70">Trend</p>
                  <p className="text-lg font-bold">
                    {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}{trend.value}°
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-12"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <SunIcon className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl text-red-300"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && days.length > 0 && (
        <>
          {/* ===== MAIN CHART CARD ===== */}
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
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Floating particles effect */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl">
                  <FireIcon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Temperature Trends</h3>
              </div>

              <TrendChart
                series={[maxSeries, minSeries, avgSeries]}
                categories={categories}
                height={350}
                condition={days[0]?.condition}
              />
            </div>
          </motion.div>

          {/* ===== INSIGHT STATS ROW ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {(() => {
              const today = days[0] || {};
              const max = Math.round(today.max || 0);
              const min = Math.round(today.min || 0);
              const range = max - min;
              const avgTemp = Math.round(today.avg || 0);

              const tiles = [
                { 
                  label: "High", 
                  value: `${max}°`,
                  icon: "🔥",
                  gradient: "from-red-500/20 to-orange-500/20",
                  border: "border-red-400/30",
                  glow: "shadow-red-500/20"
                },
                { 
                  label: "Low", 
                  value: `${min}°`,
                  icon: "❄️",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  border: "border-blue-400/30",
                  glow: "shadow-blue-500/20"
                },
                { 
                  label: "Average", 
                  value: `${avgTemp}°`,
                  icon: "📊",
                  gradient: "from-purple-500/20 to-pink-500/20",
                  border: "border-purple-400/30",
                  glow: "shadow-purple-500/20"
                },
                { 
                  label: "Range", 
                  value: `${range}°`,
                  icon: "📈",
                  gradient: "from-green-500/20 to-emerald-500/20",
                  border: "border-green-400/30",
                  glow: "shadow-green-500/20"
                },
              ];

              return tiles.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`
                    relative overflow-hidden
                    backdrop-blur-xl
                    bg-gradient-to-br ${t.gradient}
                    border ${t.border}
                    rounded-2xl
                    shadow-xl ${t.glow}
                    p-5
                    text-center
                    transition-all duration-300
                    cursor-pointer
                    group
                  `}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-semibold">{t.label}</p>
                    <p className="text-2xl font-bold">{t.value}</p>
                  </div>
                </motion.div>
              ));
            })()}
          </motion.div>

          {/* ===== DAILY FORECAST CARDS ===== */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {days.map((d, i) => {
              const isToday = i === 0;
              const temp = Math.round(d.max);
              const tempColor = temp > 30 ? 'from-red-500/20 to-orange-500/20' 
                : temp > 20 ? 'from-orange-500/20 to-yellow-500/20'
                : 'from-blue-500/20 to-cyan-500/20';

              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.4, type: "spring" }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -8,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className={`
                    relative overflow-hidden
                    group
                    backdrop-blur-2xl
                    bg-gradient-to-br ${tempColor}
                    border border-white/20
                    rounded-3xl
                    shadow-2xl
                    p-6
                    text-center
                    transition-all duration-300
                    cursor-pointer
                    ${isToday ? 'ring-2 ring-yellow-400/50 shadow-yellow-400/20' : ''}
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Today badge */}
                  {isToday && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      Today
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    {/* Day */}
                    <p className="text-sm opacity-70 mb-2 font-bold uppercase tracking-wider">
                      {new Date(d.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>

                    {/* Icon with animation */}
                    <motion.img
                      src={d.icon}
                      alt={d.condition}
                      className="mx-auto w-20 h-20 mb-3 drop-shadow-2xl"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Condition */}
                    <p className="text-sm opacity-90 mb-3 font-medium">{d.condition}</p>

                    {/* Temperature display */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                          {Math.round(d.max)}°
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm opacity-70">
                        <span>↓ {Math.round(d.min)}°</span>
                        {d.humidity && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-xs">
                            💧 {Math.round(d.humidity)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Wind speed if available */}
                    {d.wind && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs opacity-60">
                          🌬️ {Math.round(d.wind)} {unit === 'C' ? 'km/h' : 'mph'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Animated corner accent */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* ===== ADDITIONAL INSIGHTS ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              Weekly Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="opacity-80">
                <span className="font-semibold">Warmest Day:</span>{" "}
                {days.reduce((max, day) => day.max > max.max ? day : max, days[0]).date && 
                  new Date(days.reduce((max, day) => day.max > max.max ? day : max, days[0]).date).toLocaleDateString(undefined, { weekday: 'long' })
                } ({Math.round(days.reduce((max, day) => day.max > max.max ? day : max, days[0]).max)}°)
              </div>
              <div className="opacity-80">
                <span className="font-semibold">Coolest Day:</span>{" "}
                {days.reduce((min, day) => day.min < min.min ? day : min, days[0]).date &&
                  new Date(days.reduce((min, day) => day.min < min.min ? day : min, days[0]).date).toLocaleDateString(undefined, { weekday: 'long' })
                } ({Math.round(days.reduce((min, day) => day.min < min.min ? day : min, days[0]).min)}°)
              </div>
              <div className="opacity-80">
                <span className="font-semibold">Average:</span>{" "}
                {Math.round(days.reduce((sum, day) => sum + day.avg, 0) / days.length)}°
              </div>
            </div>
          </motion.div>
        </>
      )}

      {!loading && !error && days.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-12 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10"
        >
          <CloudIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg opacity-70">No forecast data available</p>
        </motion.div>
      )}
    </div>
  );
}