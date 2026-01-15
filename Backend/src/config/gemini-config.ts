import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

export const configureGemini = () => {
  if (!process.env.GEN_AI_SECRET) {
    throw new Error("GEN_AI_SECRET missing");
  }

  return new GoogleGenAI({ apiKey: process.env.GEN_AI_SECRET });
};
