import express from 'express';
const router = express.Router();

//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/plan-trip", async (req, res) => {
  const { destination, days, budget, preference, companion } = req.body;

  const genAI = req.app.get("genAI");

  
  // basic validation
  if (!destination || !days) return res.status(400).json({ error: "Missing fields" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

   const prompt = `
Generate a ${days}-day travel itinerary for ${destination} with a budget of ${budget} INR, travel preference as ${preference} and companion as ${companion}.
Return the result in valid JSON format, like this:
[
  {
    "day": 1,
    "activities": [
      { "id": "a1", "title": "Visit Eiffel Tower", "time": "10:00 AM" ,desc: "based on title"},
      { "id": "a2", "title": "Lunch at Cafe XYZ", "time": "1:00 PM" ,desc: "based on title"}
    ]
  },
  {
    "day": 2,
    "activities": [
      { "id": "a3", "title": "Louvre Museum", "time": "9:00 AM", desc: "based on title" },
      { "id": "a4", "title": "Seine River Cruise", "time": "4:00 PM", desc: "based on title" }
    ]
  }
]
Only return JSON, no extra text.
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
   

    text = text.replace(/```json\s*|```/g, "").trim();


    let plan;
    try {
        plan = JSON.parse(text);
    } catch (err) {
        console.error("Failed to parse JSON, fallback to text", err);
        plan = [{ day: 1, activities: [{ id: "error", title: text, time: "" }]}];
    }

    plan = plan
  .filter(day => day?.day && day.activities?.length) // remove empty
  .sort((a, b) => a.day - b.day)
  .map((day, idx) => ({
    ...day,
    day: idx + 1, // ensure starts from Day 1 always
  }));

    res.json({plan});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

export default router;
