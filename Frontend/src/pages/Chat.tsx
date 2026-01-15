import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import { ChatItem } from "../components/chat/chatItem";
import { IoMdSend } from "react-icons/io";
import "../index.css";
import {
  getConversations,
  getConversation,
  createConversation,
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

  const [conversationList, setConversationList] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  // Load sidebar + first chat
  useLayoutEffect(() => {
    if (!auth?.isLoggedIn) return;

    const load = async () => {
      try {
        const list = await getConversations();
        setConversationList(list);

        if (list.length > 0) {
          setActiveConversationId(list[0]._id);
          const convo = await getConversation(list[0]._id);
          setChatMessages(convo.messages);
          setTimeout(scrollToBottom, 100);
        }
      } catch {
        toast.error("Failed to load conversations");
      }
    };

    load();
  }, [auth, scrollToBottom]);

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      toast.error("Please login");
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeConversationId) return;

    if (inputRef.current) inputRef.current.value = "";

    try {
      const convo = await sendMessage(activeConversationId, content);
      setChatMessages(convo.messages);
      setTimeout(scrollToBottom, 100);
    } catch {
      toast.error("AI failed to respond");
    }
  };

  const handleNewChat = async () => {
    const convo = await createConversation();
    setConversationList(prev => [convo, ...prev]);
    setActiveConversationId(convo._id);
    setChatMessages([]);
  };

  const handleDeleteChat = async () => {
    if (!activeConversationId) return;
    await deleteConversation(activeConversationId);
    const list = await getConversations();
    setConversationList(list);
    if (list.length > 0) {
      setActiveConversationId(list[0]._id);
      const convo = await getConversation(list[0]._id);
      setChatMessages(convo.messages);
    } else {
      setActiveConversationId(null);
      setChatMessages([]);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "calc(100vh - 110px)", gap: 3, mt: 2 }}>
      
      {/* Sidebar */}
      {!isMobile && (
        <Box sx={{ width: "20%", background: "rgb(17,29,39)", borderRadius: 5, p: 2 }}>
          <Button onClick={handleNewChat} sx={{ color: "white", border: "1px solid #00fffc", mb: 2 }}>
            + New Chat
          </Button>

          {conversationList.map(c => (
            <Box
              key={c._id}
              onClick={async () => {
                setActiveConversationId(c._id);
                const convo = await getConversation(c._id);
                setChatMessages(convo.messages);
              }}
              sx={{
                p: 1.5,
                my: 0.5,
                borderRadius: 2,
                cursor: "pointer",
                background: c._id === activeConversationId ? "rgba(0,255,252,.2)" : "transparent",
                color: "white"
              }}
            >
              {c.title}
            </Box>
          ))}

          <Button onClick={handleDeleteChat} sx={{ bgcolor: red[400], mt: 2, color: "white" }}>
            Delete Chat
          </Button>
        </Box>
      )}

      {/* Chat area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflow: "auto" }}>
          {chatMessages.map((m, i) => (
            <ChatItem key={i} content={m.content} role={m.role} id={`msg-${i}`} />
          ))}
        </Box>

        <div className="chat-input-container">
          <textarea ref={inputRef} className="chat-input" placeholder="Ask anything..." />
          <IconButton onClick={handleSubmit}><IoMdSend /></IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;

