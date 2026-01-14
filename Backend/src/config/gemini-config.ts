// config/gemini-config.ts
import { GoogleGenerativeAI } from "@google/generative-ai"; // Library name change
import { config } from "dotenv";
config();

export const configureGemini = () => {
  const apiKey = process.env.GEN_AI_SECRET;
  if (!apiKey) {
    throw new Error("Gemini API secret is not configured.");
  }
  // GoogleGenerativeAI ko new keyword ke saath use karein
  return new GoogleGenerativeAI(apiKey); 
};
