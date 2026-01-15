import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
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

  // ------------------ HELPERS ------------------

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const selectConversation = async (id: string) => {
    setActiveId(id);
    const convo = await getConversation(id);
    setChatMessages(
      convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` }))
    );
    setTimeout(scrollToBottom, 100);
  };

  // ------------------ INITIAL LOAD ------------------

  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    toast.loading("Loading chats...", { id: "loading" });

    getConversations()
      .then(async (list) => {
        setConversations(list);

        if (list.length > 0) {
          await selectConversation(list[0]._id);
        }

        toast.success("Chats loaded", { id: "loading" });
      })
      .catch(() => toast.error("Failed to load chats", { id: "loading" }));
  }, [auth]);

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      toast.error("Please login");
      navigate("/login");
    }
  }, [auth, navigate]);

  // ------------------ SEND MESSAGE ------------------

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeId) return;

    if (inputRef.current) inputRef.current.value = "";

    try {
      const convo = await sendMessage(activeId, content);
      setChatMessages(
        convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` }))
      );
      setTimeout(scrollToBottom, 100);
    } catch {
      toast.error("Failed to send message");
    }
  };

  // ------------------ NEW CHAT ------------------

  const createNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveId(convo._id);
    setChatMessages([]);
  };

  // ------------------ DELETE ------------------

  const handleDeleteChat = async () => {
    if (!activeId) return;

    await deleteConversation(activeId);
    const list = await getConversations();
    setConversations(list);

    if (list.length > 0) {
      await selectConversation(list[0]._id);
    } else {
      setActiveId(null);
      setChatMessages([]);
    }
  };

  // ------------------ TEXTAREA ------------------

  const resetTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // ------------------ UI ------------------

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

      {/* SIDEBAR */}
      <Box sx={{ display: isMobile ? "none" : "flex", width: "20%", flexDirection: "column" }}>
        <Box sx={{
          display: "flex",
          width: "100%",
          flex: 1,
          backgroundColor: "rgb(17,29,39)",
          borderRadius: 5,
          flexDirection: "column",
          mx: 3,
        }}>

          <Avatar sx={{ mx: "auto", mt: 3, mb: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
            {auth?.user?.name?.charAt(0).toUpperCase()}
            {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography sx={{ mx: "auto", color: "white", fontWeight: 600 }}>
            You are talking to Skye
          </Typography>

          {/* CHAT LIST */}
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
                  background: activeId === c._id ? "rgba(0,255,252,0.2)" : "rgba(255,255,255,0.05)",
                }}
              >
                <Typography fontSize="0.9rem" noWrap>{c.title}</Typography>
              </Box>
            ))}
          </Box>

          <Button onClick={createNewChat} sx={{ mx: 2, border: "1px solid #00fffc", color: "#00fffc" }}>
            + New Chat
          </Button>

          <Button onClick={handleDeleteChat} sx={{ mx: 2, mb: 2, bgcolor: red[400], color: "white" }}>
            Clear Conversation
          </Button>

        </Box>
      </Box>

      {/* CHAT AREA */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflow: "auto" }}>
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} id={`msg-${i}`} />
          ))}
        </Box>

        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask anything..."
            onInput={resetTextareaHeight}
            onKeyDown={handleTextareaKeyDown}
          />
          <IconButton onClick={handleSubmit}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
