import { useState, useEffect, useRef } from "react";

export default function CafeRecommendations({
  itinerary,
  destination,
  onAddToItinerary,
}) {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dayPickerCafeId, setDayPickerCafeId] = useState(null);
  const [timePicker, setTimePicker] = useState(null); // { cafeId, day }
  const [addedCafeIds, setAddedCafeIds] = useState([]);
  const hasFetched = useRef(false);

  // Fetch once on mount only
  useEffect(() => {
    if (!destination || !itinerary?.length) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCafes(destination);
  }, [destination, itinerary]);

  const fetchCafes = async (dest) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { destination: dest, itinerary };

      const response = await fetch("http://127.0.0.1:4000/api/cafes/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to fetch cafes");

      const data = await response.json();
      setCafes(data.cafes || []);
    } catch (err) {
      console.error("Error fetching cafes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnMap = (cafe) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cafe.name + " " + cafe.address
    )}`;
    window.open(mapsUrl, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Finding cozy cafes for your trip...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCafes}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (cafes.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="text-blue-600 text-5xl mb-3">☕</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No cafes found
        </h3>
        <p className="text-gray-600">Try adjusting your location or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found{" "}
          <span className="font-semibold text-blue-600">{cafes.length}</span>{" "}
          cafes & restaurants for your trip
        </p>
      </div>

      {/* Cafe Cards */}
      {cafes.map((cafe) => (
        <div
          key={cafe.id}
          className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-lg transition-all ${
            addedCafeIds.includes(cafe.id)
              ? "border-green-500 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
              <img
                src={
                  cafe.photo ||
                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop"
                }
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cafe Details */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {cafe.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {cafe.address || "Central area"}
                  </p>
                </div>
                {/*<div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {getPriceText(cafe.price_level)}
                  </div>
                  <div className="text-xs text-gray-600">price level</div>
                </div> */}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(cafe.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
                {cafe.user_ratings_total && (
                  <span className="text-xs text-gray-600 ml-1">
                    ({cafe.user_ratings_total} reviews)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {dayPickerCafeId === cafe.id ? (
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600 font-medium">Pick day:</span>
                    {itinerary.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => {
                          setDayPickerCafeId(null);
                          setTimePicker({ cafeId: cafe.id, cafe, day: day.day });
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Day {day.day}
                      </button>
                    ))}
                    <button onClick={() => setDayPickerCafeId(null)} className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                  </div>
                ) : timePicker?.cafeId === cafe.id ? (
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600 font-medium">Pick time:</span>
                    {["Morning", "Lunch", "Evening", "Night"].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          onAddToItinerary(timePicker.cafe, timePicker.day, slot);
                          setAddedCafeIds((prev) => [...prev, cafe.id]);
                          setTimePicker(null);
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        {slot}
                      </button>
                    ))}
                    <button onClick={() => setTimePicker(null)} className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      addedCafeIds.includes(cafe.id)
                        ? null
                        : setDayPickerCafeId(cafe.id)
                    }
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition ${
                      addedCafeIds.includes(cafe.id)
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {addedCafeIds.includes(cafe.id) ? "✓ Added to Itinerary" : "Add to Itinerary"}
                  </button>
                )}
                {cafe.website && (
                  <button
                    onClick={() => window.open(cafe.website, "_blank")}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                  >
                    View Details
                  </button>
                )}
                <button
                  onClick={() => handleViewOnMap(cafe)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
