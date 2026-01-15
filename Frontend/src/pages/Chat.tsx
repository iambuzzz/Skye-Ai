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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  id?: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* Scroll to bottom on load */
  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  /* Load conversation list */
  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    toast.loading("Loading chats...", { id: "loading-chats" });

    getConversations()
      .then(async (list) => {
        setConversations(list);

        if (list.length > 0) {
          setActiveConversation(list[0]._id);
          const convo = await getConversation(list[0]._id);
          const msgs = convo.messages.map((m: any, i: number) => ({
            ...m,
            id: `msg-${i}`,
          }));
          setChatMessages(msgs);
          setTimeout(scrollToBottom, 100);
        }

        toast.success("Chats loaded", { id: "loading-chats" });
      })
      .catch(() => toast.error("Failed to load chats", { id: "loading-chats" }));
  }, [auth]);

  useEffect(() => {
    if (!auth?.isLoggedIn || !auth.user) {
      toast.error("Please login");
      navigate("/login");
    }
  }, [auth, navigate]);

  /* Switch conversation */
  const selectConversation = async (id: string) => {
    setActiveConversation(id);
    const convo = await getConversation(id);
    const msgs = convo.messages.map((m: any, i: number) => ({
      ...m,
      id: `msg-${i}`,
    }));
    setChatMessages(msgs);
    setTimeout(scrollToBottom, 100);
  };

  /* Send message */
  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeConversation) return;

    if (inputRef.current) inputRef.current.value = "";

    try {
      const convo = await sendMessage(activeConversation, content);
      const msgs = convo.messages.map((m: any, i: number) => ({
        ...m,
        id: `msg-${i}`,
      }));
      setChatMessages(msgs);
      setTimeout(scrollToBottom, 100);
    } catch {
      toast.error("Failed to send message");
    }
  };

  /* Create new chat */
  const handleNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveConversation(convo._id);
    setChatMessages([]);
  };

  /* Delete active chat */
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

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
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
      {/* Sidebar */}
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
          <Avatar sx={{ mx: "auto", mt: 3, mb: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
            {auth?.user?.name?.charAt(0).toUpperCase()}
            {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography sx={{ mx: "auto", fontSize: "1.25rem", fontWeight: 600, color: "white" }}>
            You are talking to Skye
          </Typography>

          <Typography sx={{ mx: "auto", mt: 1, color: "white", fontSize: "1rem" }}>
            You can ask me anything. I am here to help you.
          </Typography>

          {/* Past Chats */}
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
                  background: activeConversation === c._id
                    ? "rgba(0,255,252,0.2)"
                    : "rgba(255,255,255,0.05)",
                  "&:hover": { background: "rgba(0,255,252,0.15)" }
                }}
              >
                <Typography noWrap fontSize="0.9rem">{c.title}</Typography>
              </Box>
            ))}
          </Box>

          <Button onClick={handleNewChat} sx={{
            color: "#00fffc",
            border: "1px solid #00fffc",
            mx: 2,
            mt: 2,
          }}>
            + New Chat
          </Button>

          <Button onClick={handleDeleteChat} sx={{
            color: "white",
            bgcolor: red[400],
            mx: 2,
            mt: 2,
            mb: 3,
            "&:hover": { bgcolor: red.A400 }
          }}>
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Right Chat UI – UNCHANGED */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflow: "auto" }}>
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} id={chat.id || `msg-${i}`} />
          ))}
        </Box>

        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input custom-scroll"
            placeholder="Ask anything..."
            onKeyDown={handleTextareaKeyDown}
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
