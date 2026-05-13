import express from "express";
const router = express.Router();

router.post("/cafes/recommendations", async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Missing Destination" });
  }

  const genAI = req.app.get("genAI");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
Generate a list of 6 realistic cafe and restaurant recommendations for ${destination}, India.
Return ONLY a valid JSON object like this:
{
  "cafes": [
    {
      "id": "cafe_1",
      "name": "Cafe Name",
      "address": "Area, ${destination}",
      "rating": 4.3,
      "user_ratings_total": 850,
      "price_level": 2,
      "website": "",
      "photo": ""
    }
  ]
}
Use realistic local cafe/restaurant names and real areas in ${destination}. Price level: 1=cheap, 2=moderate, 3=expensive. Ratings between 3.5 and 5.0. Only return JSON, no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json\s*|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse cafes JSON:", err);
      return res.status(500).json({ error: "Failed to parse cafe recommendations" });
    }

    const cafeImages = [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=250&fit=crop",
    ];

    if (Array.isArray(data.cafes)) {
      data.cafes = data.cafes.map((cafe, i) => ({
        ...cafe,
        photo: cafeImages[i % cafeImages.length],
      }));
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating cafe recommendations:", error);
    res.status(500).json({ error: "Failed to fetch cafe recommendations" });
  }
});

export default router;
