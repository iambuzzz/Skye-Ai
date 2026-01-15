import React, { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import { ChatItem } from "../components/chat/chatItem";
import { IoMdSend } from "react-icons/io";
import "../index.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation
} from "../helpers/api-communicator";

type ChatMessage = { role: "user" | "assistant"; content: string; id?: string };
type Conversation = { _id: string; title: string; createdAt: string };

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ================= Load conversations on page load =================
  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    toast.loading("Loading chats...", { id: "load" });

    getConversations()
      .then(async (list) => {
        setConversations(list);

        if (list.length > 0) {
          const first = list[0];
          setActiveConversation(first._id);
          const convo = await getConversation(first._id);

          setChatMessages(
            convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` }))
          );
        }

        toast.success("Chats loaded", { id: "load" });
      })
      .catch(() => toast.error("Failed to load chats", { id: "load" }));
  }, [auth]);

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      toast.error("Please login");
      navigate("/login");
    }
  }, [auth, navigate]);

  // ================= Select conversation =================
  const selectConversation = async (id: string) => {
    setActiveConversation(id);
    const convo = await getConversation(id);
    setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
  };

  // ================= Send message =================
  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeConversation) return;

    if (inputRef.current) inputRef.current.value = "";

    const convo = await sendMessage(activeConversation, content);
    const msgs = convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` }));
    setChatMessages(msgs);

    const last = msgs[msgs.length - 1];
    if (last) setTimeout(() => scrollToMessage(last.id!), 100);
  };

  // ================= New Chat =================
  const handleNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveConversation(convo._id);
    setChatMessages([]);
  };

  // ================= Delete Chat =================
  const handleDeleteChat = async () => {
    if (!activeConversation) return;
    await deleteConversation(activeConversation);

    const list = await getConversations();
    setConversations(list);

    if (list.length > 0) {
      setActiveConversation(list[0]._id);
      const convo = await getConversation(list[0]._id);
      setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
    } else {
      setActiveConversation(null);
      setChatMessages([]);
    }
  };

  // ================= UI =================
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 110px)",
        marginTop: 2.5,
        gap: 3,
        marginBottom: 1,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <Box sx={{ display: isMobile ? "none" : "flex", width: "20%", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flex: 1,
            mt: 0,
            backgroundColor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar sx={{ mx: "auto", mt: 3, mb: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
            {auth?.user?.name?.charAt(0).toUpperCase()}
            {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography sx={{ mx: "auto", fontSize: "1.25rem", fontWeight: 600, color: "white" }}>
            You are talking to Skye
          </Typography>

          <Typography sx={{ mx: "auto", mt: 1, color: "white", fontSize: "1rem" }}>
            You can ask me anything.
          </Typography>

          {/* 🔹 CHAT LIST */}
          <Box sx={{ mt: 2, flex: 1, overflowY: "auto", px: 2 }}>
            {conversations.map((c) => (
              <Box
                key={c._id}
                onClick={() => selectConversation(c._id)}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  color: "white",
                  background:
                    activeConversation === c._id
                      ? "rgba(0,255,252,0.2)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <Typography fontSize="0.9rem" noWrap>
                  {c.title}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 🔹 NEW CHAT */}
          <Button
            onClick={handleNewChat}
            sx={{
              height: "45px",
              color: "#00fffc",
              border: "1px solid #00fffc",
              mt: 2,
              mx: "20px",
            }}
          >
            + New Chat
          </Button>

          {/* 🔹 CLEAR */}
          <Button
            onClick={handleDeleteChat}
            sx={{
              height: "50px",
              color: "white",
              bgcolor: red[400],
              mt: 2,
              mb: 3,
              mx: "20px",
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* ================= RIGHT SIDE — UNTOUCHED ================= */}
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column", paddingLeft: 3, paddingRight: 2.2 }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflow: "auto" }}>
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} id={chat.id || `msg-${i}`} />
          ))}
        </Box>

        <div className="chat-input-container">
          <textarea ref={inputRef} className="chat-input" placeholder="Ask anything..." />
          <IconButton onClick={handleSubmit}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
