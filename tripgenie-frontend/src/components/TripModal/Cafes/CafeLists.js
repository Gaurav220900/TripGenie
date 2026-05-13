import React from "react";

const CafesList = ({ cafes = [], onAddToItinerary }) => {
  if (!cafes || cafes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No cafes or restaurants found for this location.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">☕ Cafes & Restaurants Nearby</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col"
          >
            {/* Image */}
            {cafe.photo ? (
              <img
                src={cafe.photo}
                alt={cafe.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {cafe.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{cafe.address}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                {cafe.rating ? (
                  <>
                    <span className="text-yellow-500 font-medium">
                      ⭐ {cafe.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({cafe.user_ratings_total || 0} reviews)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">No rating</span>
                )}
              </div>

              {/* Price level */}
              {cafe.price_level !== undefined && (
                <p className="text-sm text-gray-600 mt-1">
                  💰 Price level:{" "}
                  {"₹".repeat(Math.max(1, cafe.price_level || 1))}
                </p>
              )}

              <div className="flex gap-2 mt-auto pt-4">
                {/* Website */}
                {cafe.website && (
                  <a
                    href={cafe.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    View Details
                  </a>
                )}

                {/* Add to itinerary */}
                {onAddToItinerary && (
                  <button
                    onClick={() => onAddToItinerary(cafe)}
                    className="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-medium"
                  >
                    Add to Itinerary
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CafesList;
