import mongoose from "mongoose";
import { randomUUID } from "crypto";

const messageSchema = new mongoose.Schema({
  id: { type: String, default: randomUUID },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true }
});

const conversationSchema = new mongoose.Schema({
  title: { type: String, default: "New Chat" },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  conversations: [conversationSchema]   
});

export default mongoose.model("User", userSchema);
