import { Request, Response } from "express";
import User from "../models/user.js";
import { configureGemini } from "../config/gemini-config.js";

// ---------- Gemini helper with retry ----------
async function callGemini(ai: any, message: string, retries = 3): Promise<string> {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",   // stable free-tier model
      contents: message,
    });
    return res.text;
  } catch (err: any) {
    if (
      (err?.status === "RESOURCE_EXHAUSTED" || err?.code === 429) &&
      retries > 0
    ) {
      await new Promise(r => setTimeout(r, 4000));
      return callGemini(ai, message, retries - 1);
    }
    throw err;
  }
}
// --------------------------------------------

export const generateChatCompletion = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid or missing message." });
    }

    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Save user message
    user.chats.push({ role: "user", content: message });

    const ai = configureGemini();
    const text = await callGemini(ai, message);

    user.chats.push({ role: "assistant", content: text });
    await user.save();

    return res.status(200).json({
      message: text,
      chats: user.chats,
    });
  } catch (error: any) {
    console.error("Gemini error:", error);

    if (
      error?.status === "RESOURCE_EXHAUSTED" ||
      error?.code === 429 ||
      error?.message?.includes("Quota")
    ) {
      return res.status(429).json({
        message: "AI is busy. Try again in a few seconds.",
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const sendChatsToUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered!");
    }

    return res.status(200).json({
      message: "OK",
      chats: user.chats,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error",
      cause: error.message,
    });
  }
};

export const deleteChats = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered!");
    }

    // Correct way to clear Mongoose DocumentArray
    user.chats.splice(0, user.chats.length);
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error",
      cause: error.message,
    });
  }
};
