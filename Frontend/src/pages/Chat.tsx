import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import { ChatItem } from "../components/chat/chatItem";
import { IoMdSend } from "react-icons/io";
import "../index.css";
import {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type ChatMessage = { role: "user" | "assistant"; content: string; id?: string };

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  // Load conversation list
  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    getConversations().then(async (list) => {
      setConversations(list);

      if (list.length > 0) {
        setActiveId(list[0]._id);
        const convo = await getConversation(list[0]._id);
        setChatMessages(convo.messages);
        setTimeout(scrollToBottom, 50);
      }
    });
  }, [auth]);

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      toast.error("Please login");
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeId) return;

    if (inputRef.current) inputRef.current.value = "";

    const convo = await sendMessage(activeId, content);
    setChatMessages(convo.messages);
    setTimeout(scrollToBottom, 50);
  };

  const handleDeleteChat = async () => {
    if (!activeId) return;

    await deleteConversation(activeId);
    const list = await getConversations();
    setConversations(list);

    if (list.length > 0) {
      setActiveId(list[0]._id);
      const convo = await getConversation(list[0]._id);
      setChatMessages(convo.messages);
    } else {
      setActiveId(null);
      setChatMessages([]);
    }
  };

  const handleNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveId(convo._id);
    setChatMessages([]);
  };

  const selectConversation = async (id: string) => {
    setActiveId(id);
    const convo = await getConversation(id);
    setChatMessages(convo.messages);
    setTimeout(scrollToBottom, 50);
  };

  return (
    <Box sx={{
      display: "flex",
      width: "100%",
      height: "calc(100vh - 110px)",
      marginTop: 2.5,
      gap: 3,
      marginBottom: 1,
      flexDirection: isMobile ? "column" : "row",
    }}>
      
      {/* LEFT SIDEBAR */}
      <Box sx={{
        display: isMobile ? "none" : "flex",
        width: "20%",
        flexDirection: "column",
      }}>
        <Box sx={{
          display: "flex",
          width: "100%",
          flex: 1,
          backgroundColor: "rgb(17,29,39)",
          borderRadius: 5,
          flexDirection: "column",
          mx: 3,
        }}>
          <Avatar sx={{ mx: "auto", mt: 3, mb: 2, bgcolor: "white", color: "black" }}>
            {auth?.user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography sx={{ mx: "auto", color: "white", fontWeight: 600 }}>
            You are talking to Skye
          </Typography>

          <Typography sx={{ mx: "auto", color: "gray", fontSize: "0.9rem" }}>
            You can ask me anything
          </Typography>

          {/* CONVERSATION LIST */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, mt: 2 }}>
            {conversations.map((c) => (
              <Box
                key={c._id}
                onClick={() => selectConversation(c._id)}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  background:
                    activeId === c._id
                      ? "rgba(0,255,252,0.25)"
                      : "rgba(255,255,255,0.05)",
                  color: "white",
                }}
              >
                {c.title}
              </Box>
            ))}
          </Box>

          <Button
            onClick={handleNewChat}
            sx={{
              border: "1px solid #00fffc",
              color: "#00fffc",
              mx: 2,
              mt: 2,
            }}
          >
            + New Chat
          </Button>

          <Button
            onClick={handleDeleteChat}
            sx={{
              bgcolor: red[400],
              color: "white",
              mx: 2,
              mt: 2,
              mb: 3,
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* RIGHT CHAT AREA — EXACTLY YOUR OLD UI */}
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <Box
          ref={chatAreaRef}
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} id={`msg-${i}`} />
          ))}
        </Box>

        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input custom-scroll"
            placeholder="Ask anything..."
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white" }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
