import { useEffect, useState } from "react";

function CitySuggestions({ query, onSelect, theme = "dark" }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        // Using WeatherAPI search endpoint directly (fast + free)
        const res = await fetch(
          `/api/cities?q=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) return;

        const data = await res.json();
        setSuggestions(data || []);
      } catch (_) {}
    };

    const timer = setTimeout(fetchSuggestions, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!suggestions.length) return null;

  const bg =
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-300";

  return (
    <div
      className={`absolute top-12 left-0 w-full rounded-lg shadow-lg border z-50 ${bg}`}
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="block w-full text-left px-4 py-2 hover:bg-yellow-400/20 transition"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default CitySuggestions;
