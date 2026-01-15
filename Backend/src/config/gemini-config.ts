import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

export const configureGemini = () => {
  const apiKey = process.env.GEN_AI_SECRET;

  if (!apiKey) {
    throw new Error("GEN_AI_SECRET missing in .env");
  }

  return new GoogleGenerativeAI(apiKey);
};
