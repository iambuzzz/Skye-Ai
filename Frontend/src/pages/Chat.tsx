import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
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
  // const [loading] = useState(false);

  const scrollToMessage = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Load conversations on start */
  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    toast.loading("Loading chats...", { id: "loading" });

    getConversations()
      .then(async (list) => {
        setConversations(list);

        if (list.length > 0) {
          setActiveId(list[0]._id);
          const convo = await getConversation(list[0]._id);
          const msgs = convo.messages.map((m: any, i: number) => ({
            ...m,
            id: `msg-${i}`,
          }));
          setChatMessages(msgs);
        }
        toast.success("Chats loaded!", { id: "loading" });
      })
      .catch(() => toast.error("Failed to load chats", { id: "loading" }));
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

    try {
      const convo = await sendMessage(activeId, content);
      const msgs = convo.messages.map((m: any, i: number) => ({
        ...m,
        id: `msg-${i}`,
      }));
      setChatMessages(msgs);

      const last = msgs[msgs.length - 1];
      if (last) setTimeout(() => scrollToMessage(last.id!), 100);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleDeleteChat = async () => {
    if (!activeId) return;

    await deleteConversation(activeId);
    const list = await getConversations();
    setConversations(list);
    setChatMessages([]);

    if (list.length > 0) {
      setActiveId(list[0]._id);
      const convo = await getConversation(list[0]._id);
      setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
    } else {
      setActiveId(null);
    }
  };

  const createNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveId(convo._id);
    setChatMessages([]);
  };

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

  return (
    <Box sx={{ display: "flex", width: "100%", height: "calc(100vh - 110px)", mt: 2.5, gap: 3 }}>
      {/* Sidebar */}
      <Box sx={{ display: isMobile ? "none" : "flex", width: "20%", flexDirection: "column" }}>
        <Box sx={{ flex: 1, backgroundColor: "rgb(17,29,39)", borderRadius: 5, mx: 3, p: 2 }}>
          <Avatar sx={{ mx: "auto", mt: 2 }}>
            {auth.user?.name.charAt(0)}
          </Avatar>

          <Button fullWidth sx={{ mt: 2 }} onClick={createNewChat}>
            + New Chat
          </Button>

          <Box sx={{ maxHeight: "300px", overflowY: "auto", mt: 2 }}>
            {conversations.map((c) => (
              <Box
                key={c._id}
                onClick={async () => {
                  setActiveId(c._id);
                  const convo = await getConversation(c._id);
                  setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
                }}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  background: activeId === c._id ? "rgba(0,255,252,0.2)" : "rgba(255,255,255,0.05)",
                  color: "white",
                }}
              >
                {c.title}
              </Box>
            ))}
          </Box>

          <Button onClick={handleDeleteChat} sx={{ mt: "auto" }} color="error">
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflow: "auto" }}>
          {chatMessages.map((chat, i) => (
            <ChatItem key={i} content={chat.content} role={chat.role} id={chat.id || `msg-${i}`} />
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

