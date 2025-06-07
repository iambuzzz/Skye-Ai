// config/gemini-config.ts
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

export const configureGemini = () => {
  const apiKey = process.env.GEN_AI_SECRET;
  if (!apiKey) {
    throw new Error("Gemini API secret is not configured.");
  }
  return new GoogleGenAI({ apiKey });
};
