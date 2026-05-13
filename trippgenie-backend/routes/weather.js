import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/weather", async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Missing destination" });
  }

  try {
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    // Step 1: Geocode destination to lat/lng using Google Geocoding API
    const geoResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: destination,
          key: GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const { lat, lng } = geoResponse.data.results[0].geometry.location;

    // Step 2: Fetch 7-day forecast from Open-Meteo (free, no key needed)
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lng,
          daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "weathercode",
            "windspeed_10m_max",
          ].join(","),
          current_weather: true,
          timezone: "auto",
          forecast_days: 7,
        },
      }
    );

    const { current_weather, daily } = weatherResponse.data;

    // Map WMO weather codes to descriptions and emojis
    const getWeatherInfo = (code) => {
      if (code === 0) return { desc: "Clear sky", emoji: "☀️" };
      if (code <= 2) return { desc: "Partly cloudy", emoji: "⛅" };
      if (code === 3) return { desc: "Overcast", emoji: "☁️" };
      if (code <= 49) return { desc: "Foggy", emoji: "🌫️" };
      if (code <= 59) return { desc: "Drizzle", emoji: "🌦️" };
      if (code <= 69) return { desc: "Rain", emoji: "🌧️" };
      if (code <= 79) return { desc: "Snow", emoji: "❄️" };
      if (code <= 84) return { desc: "Rain showers", emoji: "🌧️" };
      if (code <= 94) return { desc: "Snow showers", emoji: "🌨️" };
      return { desc: "Thunderstorm", emoji: "⛈️" };
    };

    const forecast = daily.time.map((date, i) => ({
      date,
      max_temp: Math.round(daily.temperature_2m_max[i]),
      min_temp: Math.round(daily.temperature_2m_min[i]),
      precipitation: daily.precipitation_sum[i],
      wind_speed: Math.round(daily.windspeed_10m_max[i]),
      ...getWeatherInfo(daily.weathercode[i]),
    }));

    const currentInfo = getWeatherInfo(current_weather.weathercode);

    res.status(200).json({
      destination,
      current: {
        temp: Math.round(current_weather.temperature),
        wind_speed: Math.round(current_weather.windspeed),
        ...currentInfo,
      },
      forecast,
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default router;
