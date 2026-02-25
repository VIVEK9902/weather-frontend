import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

function MapClickHandler({ onLocationSelect }) {
      useMapEvents({
        click(e) {
          if (!onLocationSelect) return;
          const { lat, lng } = e.latlng;

          // send coords to App.jsx
          onLocationSelect(`${lat},${lng}`);
    }
  });

  return null;
}

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({ city, onLocationSelect }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch if city is empty/undefined
    if (!city || city.trim() === "") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:9090/api/weather?city=${encodeURIComponent(city)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weather data');
        return res.json();
      })
      .then(weatherData => {
        // Validate that we have coordinates
        if (!weatherData.lat || !weatherData.lon) {
          throw new Error('No coordinates in response');
        }

        setData({
          city: weatherData.city,
          lat: weatherData.lat,
          lon: weatherData.lon,
          temp: weatherData.temp_c,
          condition: weatherData.condition,
          icon: weatherData.icon
        });
        setError(null);
      })
      .catch(err => {
        console.error('Map fetch error:', err);
        setError('Unable to load map data. Please search for a city first.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [city]);

  if (!city) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold tracking-wide mb-6">Map</h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-12 text-center">
          <p className="text-lg">Please search for a city to view the map</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold tracking-wide mb-6">Map — Loading...</h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-12 text-center">
          <p className="text-lg">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold tracking-wide mb-6">Map</h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-12 text-center">
          <p className="text-lg text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.lat || !data.lon) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold tracking-wide mb-6">Map</h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-12 text-center">
          <p className="text-lg">No map data available</p>
        </div>
      </div>
    );
  }

  
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold tracking-wide">
        Map — {data.city}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm"
        style={{ height: "520px" }}
      >
        <MapContainer
          center={[data.lat, data.lon]}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={onLocationSelect} />

          <Marker position={[data.lat, data.lon]}>
            <Popup>
              <div className="text-center">
                {data.icon && (
                  <img
                    src={`https:${data.icon}`}
                    alt={data.condition}
                    className="mx-auto w-10 h-10"
                  />
                )}
                <p className="font-semibold text-gray-900">{data.city}</p>
                <p className="text-gray-900">{Math.round(data.temp)}°C</p>
                <p className="text-sm text-gray-600">{data.condition}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </motion.div>
    </div>
  );
}