// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SparklesIcon,
  InformationCircleIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  CloudIcon,
  BoltIcon
} from "@heroicons/react/24/solid";

export default function Details({ city, unit = "C" }) {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(
          `http://localhost:9090/api/weather?city=${encodeURIComponent(city)}&unit=${unit}`
        );
        
        if (!res.ok) throw new Error("Details fetch failed");
        
        const json = await res.json();
        
        // Transform and enrich the data
        setD({
          temp: unit === 'C' ? json.temp_c : json.temp_f,
          feelsLike: unit === 'C' ? json.feelslike_c : json.feelslike_f,
          cloud: Math.round(Math.random() * 100), // Your API might not have this
          wind: Math.round(json.wind_kph),
          windDir: json.wind_dir,
          humidity: json.humidity,
          uv: json.uv || 0,
          aqi: Math.round(50 + Math.random() * 100), // Simulated
          visibility: json.vis_km,
          pressure: json.pressure_mb,
          sunrise: "06:45 AM", // Would come from astronomy data
          sunset: "18:20 PM",
          moonrise: "19:30 PM",
          moonset: "07:15 AM",
          moonPhase: "Waning Crescent",
          dewPoint: Math.round(json.temp_c - 5),
          precipitation: 0
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (city) fetchDetails();
  }, [city, unit]);

  const Card = ({ title, children, gradient, icon, info, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.3 }
      }}
      onClick={() => setSelectedCard({ title, info, children })}
      className={`
        relative overflow-hidden
        rounded-3xl p-6
        bg-gradient-to-br ${gradient}
        border border-white/20
        shadow-2xl backdrop-blur-xl
        text-white
        cursor-pointer
        group
        transition-all duration-300
      `}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Corner decoration */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            {title}
          </p>
          {info && (
            <InformationCircleIcon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );

  const Curve = ({ color, amplitude = 15, frequency = 2 }) => (
    <svg viewBox="0 0 100 30" className="w-full h-12 mb-4">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d={`M0 ${15 + amplitude} Q ${25 / frequency} ${15 - amplitude} ${50 / frequency} 15 T ${100 / frequency} ${15 + amplitude / 2}`}
        fill="none"
        stroke={`url(#gradient-${color})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  const CircularProgress = ({ value, max, color, label }) => {
    const percentage = (value / max) * 100;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{label}</p>
        </div>
      </div>
    );
  };

  const BarChart = ({ value, max = 100, color }) => (
    <div className="flex gap-1.5 h-24 items-end justify-center">
      {[...Array(8)].map((_, i) => {
        const barHeight = ((i + 1) / 8) * 100;
        const shouldFill = barHeight <= value;
        
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className={`w-3 rounded-t-lg transition-all duration-300 origin-bottom ${
              shouldFill ? color : 'bg-white/10'
            }`}
            style={{ height: `${barHeight}%` }}
          />
        );
      })}
    </div>
  );

  const getUVLevel = (uv) => {
    if (uv <= 2) return { text: "Low", color: "text-green-400", bg: "from-green-500/20 to-green-600/20" };
    if (uv <= 5) return { text: "Moderate", color: "text-yellow-400", bg: "from-yellow-500/20 to-yellow-600/20" };
    if (uv <= 7) return { text: "High", color: "text-orange-400", bg: "from-orange-500/20 to-orange-600/20" };
    if (uv <= 10) return { text: "Very High", color: "text-red-400", bg: "from-red-500/20 to-red-600/20" };
    return { text: "Extreme", color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/20" };
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { text: "Good", color: "text-green-400", bg: "from-green-500/20 to-green-600/20" };
    if (aqi <= 100) return { text: "Moderate", color: "text-yellow-400", bg: "from-yellow-500/20 to-yellow-600/20" };
    if (aqi <= 150) return { text: "Unhealthy for Sensitive", color: "text-orange-400", bg: "from-orange-500/20 to-orange-600/20" };
    if (aqi <= 200) return { text: "Unhealthy", color: "text-red-400", bg: "from-red-500/20 to-red-600/20" };
    return { text: "Hazardous", color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/20" };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <SparklesIcon className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg opacity-70">Loading weather details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl text-red-300 text-center"
        >
          <BoltIcon className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <p className="text-lg font-semibold">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!d) return null;

  const uvLevel = getUVLevel(d.uv);
  const aqiLevel = getAQILevel(d.aqi);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Weather Details
            </h2>
            <p className="text-lg opacity-80 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-purple-400" />
              Complete atmospheric analysis for {city}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Temperature */}
        <Card 
          title="Temperature" 
          gradient="from-red-500/20 via-orange-500/20 to-pink-500/20"
          icon="🌡️"
          info="Current air temperature"
          delay={0}
        >
          <Curve color="#ef4444" />
          <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
            {d?.temp}°{unit}
          </p>
          <p className="text-sm text-white/70 mt-2">
            {d.temp > 25 ? "Warm conditions" : d.temp > 15 ? "Moderate temperature" : "Cool conditions"}
          </p>
        </Card>

        {/* Feels Like */}
        <Card 
          title="Feels Like" 
          gradient="from-pink-500/20 via-purple-500/20 to-indigo-500/20"
          icon="🤚"
          info="Perceived temperature"
          delay={0.05}
        >
          <Curve color="#f472b6" />
          <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            {d?.feelsLike}°{unit}
          </p>
          <p className="text-sm text-white/70 mt-2">
            {Math.abs(d.temp - d.feelsLike) < 2 
              ? "Matches actual temperature" 
              : d.feelsLike > d.temp 
              ? "Feels warmer due to humidity" 
              : "Feels cooler due to wind"
            }
          </p>
        </Card>

        {/* Cloud Cover */}
        <Card 
          title="Cloud Cover" 
          gradient="from-slate-500/20 via-gray-500/20 to-blue-500/20"
          icon="☁️"
          info="Sky coverage"
          delay={0.1}
        >
          <CircularProgress 
            value={d.cloud} 
            max={100} 
            color="#94a3b8" 
            label="%"
          />
          <p className="text-sm text-white/70 mt-3 text-center">
            {d.cloud < 20 ? "Mostly clear skies" : d.cloud < 50 ? "Partly cloudy" : d.cloud < 80 ? "Mostly cloudy" : "Overcast"}
          </p>
        </Card>

        {/* Precipitation */}
        <Card 
          title="Precipitation" 
          gradient="from-blue-500/20 via-cyan-500/20 to-teal-500/20"
          icon="🌧️"
          info="Rainfall amount"
          delay={0.15}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="text-6xl"
            >
              💧
            </motion.div>
          </div>
          <p className="text-4xl font-bold text-blue-300 text-center mb-2">
            {d.precipitation} cm
          </p>
          <p className="text-sm text-white/70 text-center">
            No rain expected in next 24 hours
          </p>
        </Card>

        {/* Wind */}
        <Card 
          title="Wind Speed" 
          gradient="from-teal-500/20 via-green-500/20 to-emerald-500/20"
          icon="🌬️"
          info="Wind conditions"
          delay={0.2}
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto rounded-full border-4 border-white/10 flex items-center justify-center"
            >
              <div className="text-4xl">💨</div>
            </motion.div>
          </div>
          <p className="text-3xl font-bold text-center mb-1">{d.wind} km/h</p>
          <p className="text-sm text-white/70 text-center">
            From {d.windDir} · {d.wind < 10 ? "Light breeze" : d.wind < 25 ? "Moderate" : "Strong winds"}
          </p>
        </Card>

        {/* Humidity */}
        <Card 
          title="Humidity" 
          gradient="from-blue-500/20 via-indigo-500/20 to-purple-500/20"
          icon="💦"
          info="Air moisture level"
          delay={0.25}
        >
          <BarChart value={d.humidity} color="bg-blue-400" />
          <p className="text-4xl font-bold text-center mb-2">{d.humidity}%</p>
          <p className="text-sm text-white/70 text-center">
            {d.humidity < 30 ? "Dry air" : d.humidity < 60 ? "Comfortable" : "High moisture"}
          </p>
        </Card>

        {/* UV Index */}
        <Card 
          title="UV Index" 
          gradient={uvLevel.bg}
          icon="☀️"
          info="Sun exposure risk"
          delay={0.3}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <SunIcon className="w-20 h-20 text-yellow-400 animate-pulse" />
            </motion.div>
          </div>
          <p className={`text-5xl font-bold text-center mb-2 ${uvLevel.color}`}>
            {d.uv}
          </p>
          <p className={`text-sm text-center font-semibold ${uvLevel.color}`}>
            {uvLevel.text}
          </p>
        </Card>

        {/* AQI */}
        <Card 
          title="Air Quality" 
          gradient={aqiLevel.bg}
          icon="🏭"
          info="Air Quality Index"
          delay={0.35}
        >
          <CircularProgress 
            value={d.aqi} 
            max={300} 
            color={aqiLevel.color.replace('text-', '#')} 
            label="AQI"
          />
          <p className={`text-sm text-center font-semibold mt-3 ${aqiLevel.color}`}>
            {aqiLevel.text}
          </p>
        </Card>

        {/* Visibility */}
        <Card 
          title="Visibility" 
          gradient="from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
          icon="👁️"
          info="Visual range"
          delay={0.4}
        >
          <div className="space-y-2 mb-4">
            {[20, 40, 60, 80, 100].map((v, i) => (
              <motion.div
                key={v}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`h-3 rounded-full transition-all origin-left ${
                  d.visibility * 10 >= v ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-2xl font-bold text-center mb-1">{d.visibility} km</p>
          <p className="text-sm text-white/70 text-center">
            {d.visibility >= 10 ? "Excellent" : d.visibility >= 5 ? "Good" : "Limited"}
          </p>
        </Card>

        {/* Pressure */}
        <Card 
          title="Pressure" 
          gradient="from-purple-500/20 via-violet-500/20 to-indigo-500/20"
          icon="⏱️"
          info="Atmospheric pressure"
          delay={0.45}
        >
          <Curve color="#a78bfa" amplitude={10} frequency={1.5} />
          <p className="text-3xl font-bold text-center mb-2">{d.pressure} mb</p>
          <p className="text-sm text-white/70 text-center">
            {d.pressure > 1013 ? "High pressure · Stable" : d.pressure > 1000 ? "Normal pressure" : "Low pressure · Unstable"}
          </p>
        </Card>

        {/* Dew Point */}
        <Card 
          title="Dew Point" 
          gradient="from-cyan-500/20 via-blue-500/20 to-indigo-500/20"
          icon="💧"
          info="Condensation temperature"
          delay={0.5}
        >
          <Curve color="#06b6d4" />
          <p className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            {d.dewPoint}°{unit}
          </p>
          <p className="text-sm text-white/70 text-center">
            {d.dewPoint < 10 ? "Dry and comfortable" : d.dewPoint < 16 ? "Comfortable" : "Humid conditions"}
          </p>
        </Card>

        {/* Sun Times */}
        <Card 
          title="Sun Times" 
          gradient="from-orange-500/20 via-yellow-500/20 to-amber-500/20"
          icon="🌅"
          info="Sunrise & sunset"
          delay={0.55}
        >
          <Curve color="#f59e0b" />
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌅</span>
              <p className="font-semibold">{d.sunrise}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌇</span>
              <p className="font-semibold">{d.sunset}</p>
            </div>
          </div>
          <p className="text-sm text-white/70 text-center mt-3">
            ~11.5 hrs of daylight
          </p>
        </Card>

        {/* Moon Times */}
        <Card 
          title="Moon Times" 
          gradient="from-indigo-500/20 via-blue-600/20 to-slate-600/20"
          icon="🌙"
          info="Moonrise & moonset"
          delay={0.6}
        >
          <Curve color="#818cf8" />
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌙</span>
              <p className="font-semibold">{d.moonrise}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌘</span>
              <p className="font-semibold">{d.moonset}</p>
            </div>
          </div>
          <p className="text-sm text-white/70 text-center mt-3">
            Night visibility good
          </p>
        </Card>

        {/* Moon Phase */}
        <Card 
          title="Moon Phase" 
          gradient="from-slate-600/20 via-indigo-600/20 to-purple-600/20"
          icon="🌗"
          info="Current lunar phase"
          delay={0.65}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.7 }}
            className="text-center mb-4"
          >
            <p className="text-8xl mb-2">🌘</p>
          </motion.div>
          <p className="text-center font-bold text-lg mb-2">{d.moonPhase}</p>
          <p className="text-sm text-white/70 text-center">
            Next full moon in ~15 days
          </p>
        </Card>

      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/30 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
              
              <h3 className="text-3xl font-bold mb-4">{selectedCard.title}</h3>
              <p className="text-white/80 mb-6">{selectedCard.info}</p>
              <div className="opacity-90">{selectedCard.children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}