import { Request, Response } from "express";
import User from "../models/user.js";
import { configureGemini } from "../config/gemini-config.js";

export const generateChatCompletion = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid or missing message." });
    }

    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.chats.push({ role: "user", content: message });

    // ---- Gemini Call ----
    const genAI = configureGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return res.status(500).json({ message: "Empty response from Gemini" });
    }

    user.chats.push({ role: "assistant", content: text });
    await user.save();

    return res.status(200).json({
      message: text,
      chats: user.chats,
    });
  } catch (error: any) {
    console.error("Gemini error:", error);

    // ---- Handle Gemini quota / rate limit ----
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

    if (!user) return res.status(401).send("User not registered!");

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
    if (!user) return res.status(401).send("User not registered!");

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

