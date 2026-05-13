import express from "express";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { userPrompt, currentPlan } = req.body;
  const genAI = req.app.get("genAI");

  if (!userPrompt || !currentPlan) {
    return res.status(400).json({ error: "Missing userPrompt or currentPlan" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are an expert travel planner AI.
The user has this current itinerary:

${JSON.stringify(currentPlan, null, 2)}

The user said: "${userPrompt}"

IMPORTANT rules:
- Only modify the specific day(s) the user mentions. Keep ALL other days exactly unchanged.
- If the user says "Day 2", only change day 2's activities. Return all other days as-is.
- Return the COMPLETE itinerary (all days) in the same JSON format.

Format:
[
  { "day": 1, "activities": [ { "id": "a1", "title": "Activity", "time": "9:00 AM", "desc": "Description" } ] }
]

Return ONLY valid JSON — no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\s*|```/g, "").trim();

    let modifiedPlan;
    try {
      modifiedPlan = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      modifiedPlan = currentPlan;
    }

    res.json({ plan: modifiedPlan });
  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).json({ error: "Failed to modify plan" });
  }
});

export default router;
