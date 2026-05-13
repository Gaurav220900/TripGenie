import { useState, useEffect } from "react";

export default function WeatherWidget({ destination, onClose }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:4000/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination }),
        });
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold">Weather Forecast</h2>
            <p className="text-blue-100 text-sm">{destination}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 text-2xl font-bold">✕</button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-500">Fetching weather...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 text-4xl mb-2">⚠️</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {weather && !loading && (
            <>
              {/* Current Weather */}
              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 mb-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Right now</p>
                  <p className="text-4xl font-bold text-gray-800">{weather.current.temp}°C</p>
                  <p className="text-gray-600 mt-1">{weather.current.desc}</p>
                </div>
                <div className="text-center">
                  <span className="text-6xl">{weather.current.emoji}</span>
                  <p className="text-xs text-gray-500 mt-1">💨 {weather.current.wind_speed} km/h</p>
                </div>
              </div>

              {/* 7-day Forecast */}
              <p className="text-sm font-semibold text-gray-600 mb-3">7-Day Forecast</p>
              <div className="space-y-2">
                {weather.forecast.map((day, i) => {
                  const date = new Date(day.date);
                  const label = i === 0 ? "Today" : date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                  return (
                    <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700 w-28">{label}</span>
                      <span className="text-xl">{day.emoji}</span>
                      <span className="text-xs text-gray-500 flex-1 text-center">{day.desc}</span>
                      <div className="text-sm text-right">
                        <span className="font-semibold text-gray-800">{day.max_temp}°</span>
                        <span className="text-gray-400 ml-1">{day.min_temp}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {weather.forecast.some((d) => d.precipitation > 0) && (
                <p className="text-xs text-blue-500 mt-3 text-center">
                  💧 Carry an umbrella — rain expected on some days
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
