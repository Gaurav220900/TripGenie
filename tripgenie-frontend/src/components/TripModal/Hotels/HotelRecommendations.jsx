import { useState, useEffect } from "react";

// Hotel Recommendations Component
export default function HotelRecommendations({ 
  itinerary, 
  personalizedFormData, 
  onHotelSelect, 
  selectedHotel 
}) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch hotels whenever itinerary or form data changes
  useEffect(() => {
    if (!itinerary || itinerary.length === 0) return;
    
    fetchHotels();
  }, [itinerary, personalizedFormData]);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the request payload
      const payload = {
        itinerary: itinerary,
        // Include personalized preferences if form was filled
        ...(personalizedFormData && {
          budget_per_night: personalizedFormData.budget,
          star_rating: personalizedFormData.starRating,
          location_preference: personalizedFormData.locationPreference,
          amenities: personalizedFormData.amenities,
          room_type: personalizedFormData.roomType,
        })
      };

      // Replace with your actual API endpoint
      const response = await fetch('http://127.0.0.1:4000/api/hotels/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel recommendations');
      }

      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceColor = (distance) => {
    if (!distance) return 'text-gray-600 bg-gray-100';
    if (distance < 2) return 'text-green-600 bg-green-50';
    if (distance < 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDistanceLabel = (distance) => {
    if (!distance) return 'N/A';
    if (distance < 2) return 'Walkable';
    if (distance < 5) return 'Short drive';
    return 'Plan transport';
  };

  const handleViewOnMap = (hotel) => {
    // Open Google Maps with hotel location
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Finding the perfect hotels for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchHotels}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="text-blue-600 text-5xl mb-3">🏨</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No hotels found</h3>
        <p className="text-gray-600">Try adjusting your filters for more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found <span className="font-semibold text-blue-600">{hotels.length}</span> hotels for your trip
        </p>
        {personalizedFormData && (
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ✓ Personalized
          </span>
        )}
      </div>

      {/* Hotel Cards */}
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-lg transition-all ${
            selectedHotel?.id === hotel.id ? 'border-blue-600 shadow-md' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
              <img
                src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              {hotel.is_featured && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Hotel Details */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{hotel.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {hotel.location || 'Central Location'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ${hotel.price_per_night || hotel.price}
                  </div>
                  <div className="text-xs text-gray-600">per night</div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < (hotel.star_rating || hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
                {hotel.reviews_count && (
                  <span className="text-xs text-gray-600 ml-1">
                    ({hotel.reviews_count} reviews)
                  </span>
                )}
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="text-xs text-blue-600">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Distance Info */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${getDistanceColor(hotel.avg_distance_to_activities)}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Avg {hotel.avg_distance_to_activities || 'N/A'} km to activities
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getDistanceColor(hotel.avg_distance_to_activities)}`}>
                  {getDistanceLabel(hotel.avg_distance_to_activities)}
                </span>
                <button
                  onClick={() => handleViewOnMap(hotel)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                  </svg>
                  View on map
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onHotelSelect(selectedHotel?.id === hotel.id ? null : hotel)}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition ${
                    selectedHotel?.id === hotel.id
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedHotel?.id === hotel.id ? '✓ Selected' : 'Select This Hotel'}
                </button>
                {hotel.booking_url && (
                  <button
                    onClick={() => window.open(hotel.booking_url, '_blank')}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Example of expected hotel data structure:
/*
{
  id: 1,
  name: "Grand Palace Hotel",
  location: "Near Eiffel Tower",
  price_per_night: 180,
  star_rating: 5,
  reviews_count: 342,
  image: "https://...",
  amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
  avg_distance_to_activities: 2.1,
  is_featured: true,
  booking_url: "https://..."
}
*/