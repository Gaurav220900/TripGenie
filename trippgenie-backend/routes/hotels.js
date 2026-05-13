import express from "express";
const router = express.Router();

router.post("/hotels/recommendations", async (req, res) => {
  const { destination, budget_per_night, star_rating, location_preference, amenities } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Missing Destination" });
  }

  const genAI = req.app.get("genAI");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const preferences = [
      budget_per_night ? `budget around ₹${budget_per_night} per night` : "",
      star_rating ? `${star_rating} star rating` : "",
      location_preference ? `location preference: ${location_preference}` : "",
      amenities?.length ? `amenities: ${amenities.join(", ")}` : "",
    ].filter(Boolean).join(", ");

    const prompt = `
Generate a list of 6 realistic hotel recommendations for ${destination}${preferences ? ` with ${preferences}` : ""}.
Return ONLY a valid JSON array like this:
[
  {
    "id": "hotel_1",
    "name": "Hotel Name",
    "location": "Area, ${destination}",
    "price_per_night": 3500,
    "star_rating": 4,
    "reviews_count": 1240,
    "avg_distance_to_activities": 1.2,
    "is_featured": true,
    "description": "Brief description of the hotel",
    "amenities": ["Free WiFi", "Pool", "Restaurant"],
    "booking_url": ""
  }
]
Use realistic Indian hotel names, real areas in ${destination}, prices in INR, and vary the star ratings from 3 to 5.
First 2 hotels should have is_featured: true. Only return JSON, no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json\s*|```/g, "").trim();

    let hotels;
    try {
      hotels = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse hotels JSON:", err);
      return res.status(500).json({ error: "Failed to parse hotel recommendations" });
    }

    const hotelImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=250&fit=crop",
    ];

    hotels = hotels.map((hotel, i) => ({
      ...hotel,
      image: hotelImages[i % hotelImages.length],
      booking_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " " + hotel.location)}`,
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error generating hotel recommendations:", error);
    res.status(500).json({ error: "Failed to fetch hotel recommendations" });
  }
});

export default router;
