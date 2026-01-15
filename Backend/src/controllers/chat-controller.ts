import { Request, Response } from "express";
import User from "../models/user.js";
import { configureGemini } from "../config/gemini-config.js";

export const createConversation = async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.jwtData.id);
  if (!user) return res.status(401).send("User not found");

  user.conversations.unshift({
    title: "New Chat",
    messages: []
  });

  await user.save();
  res.status(201).json(user.conversations[0]);
};

export const getConversations = async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.jwtData.id);
  if (!user) return res.status(401).send("User not found");

  const list = user.conversations.map(c => ({
    _id: c._id,
    title: c.title,
    createdAt: c.createdAt
  }));

  res.json(list);
};

export const getConversation = async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.jwtData.id);
  const convo = user?.conversations.id(req.params.id);
  if (!convo) return res.status(404).send("Chat not found");

  res.json(convo);
};

export const sendMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  const user = await User.findById(res.locals.jwtData.id);
  const convo = user?.conversations.id(req.params.id);
  if (!convo) return res.status(404).send("Chat not found");

  convo.messages.push({ role: "user", content: message });

  const last10 = convo.messages.slice(-10).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const ai = configureGemini();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: last10
  });

  const text = response.text;

  convo.messages.push({ role: "assistant", content: text });

  if (convo.messages.length === 2) {
    convo.title = message.slice(0, 40);
  }

  await user.save();
  res.json(convo);
};

export const deleteConversation = async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.jwtData.id);
  user?.conversations.id(req.params.id)?.deleteOne();
  await user?.save();
  res.json({ message: "Deleted" });
};
