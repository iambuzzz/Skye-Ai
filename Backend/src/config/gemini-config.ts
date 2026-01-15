import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();

export const configureGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};
