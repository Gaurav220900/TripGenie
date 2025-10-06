// server.js (Node/Express)
import express from "express";
import fetch from "node-fetch"; // or use openai npm package
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3001", "http://127.0.0.1:3001"], 
  credentials: false,            
}));


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


  async function listModels() {
  try {
    const res = await fetch( `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

app.post("/api/plan-trip", async (req, res) => {
  const { destination, days, budget, preference, companion } = req.body;
  console.log(req.body);
 
  
  // basic validation
  if (!destination || !days) return res.status(400).json({ error: "Missing fields" });

 /* const prompt = `Generate a ${days}-day travel itinerary for ${destination} with a budget of INR${budget}. 
  Include day-by-day activities, estimated costs, and travel tips.`; */

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

    res.json({plan});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.listen(4000, () => console.log("Server listening on :4000"));
