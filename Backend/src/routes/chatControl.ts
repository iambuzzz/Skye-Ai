import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation
} from "../controllers/chat-controller.js";

const router = Router();

router.post("/new", verifyToken, createConversation);
router.get("/list", verifyToken, getConversations);
router.get("/:id", verifyToken, getConversation);
router.post("/:id", verifyToken, sendMessage);
router.delete("/:id", verifyToken, deleteConversation);

export default router;
