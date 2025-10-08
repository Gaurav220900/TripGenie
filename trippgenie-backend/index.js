// server.js (Node/Express)
import express from "express";
import fetch from "node-fetch"; // or use openai npm package
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatRoutes from "./routes/chatbot.js";
import planRoutes from './routes/planRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], 
  credentials: false,            
}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.set("genAI", genAI);


app.use('/api', chatRoutes);
app.use('/api',planRoutes);




app.listen(4000, () => console.log("Server listening on :4000"));
