import express from "express";
const router = express.Router();

router.post("/hotels/distances", async (req, res) => {
  const { hotel, itinerary, destination } = req.body;

  if (!hotel || !itinerary || !destination) {
    return res.status(400).json({ error: "Missing hotel, itinerary, or destination" });
  }

  const genAI = req.app.get("genAI");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Flatten all activities from itinerary
    const activities = itinerary.flatMap((day) =>
      (day.activities || []).map((act) => ({
        day: day.day,
        title: act.title,
      }))
    );

    const prompt = `
You are a travel assistant. Given a hotel and a list of travel activities in ${destination}, estimate the distance (in km) and travel time from the hotel to each activity location.

Hotel: "${hotel.name}" located at "${hotel.location}"

Activities:
${activities.map((a, i) => `${i + 1}. Day ${a.day}: ${a.title}`).join("\n")}

Return ONLY a valid JSON array like this:
[
  {
    "day": 1,
    "activity": "Activity title",
    "distance_km": 2.5,
    "travel_time": "10 mins by taxi",
    "mode": "taxi"
  }
]

Use realistic estimates based on typical locations of these activities in ${destination}. Keep travel_time short and practical. Only return JSON, no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json\s*|```/g, "").trim();

    let distances;
    try {
      distances = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse distances JSON:", err);
      return res.status(500).json({ error: "Failed to parse distances" });
    }

    res.status(200).json(distances);
  } catch (error) {
    console.error("Error generating distances:", error);
    res.status(500).json({ error: "Failed to calculate distances" });
  }
});

export default router;
