import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Drawer,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { indigo, red } from "@mui/material/colors";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ChatItem } from "../components/chat/chatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation,
} from "../helpers/api-communicator";

// 1. Props Type Definition
type ChatProps = {
  drawerOpen: boolean;
};

type ChatMessage = { role: "user" | "assistant"; content: string; id?: string };
type Conversation = { _id: string; title: string; createdAt: string };

const Chat = ({ drawerOpen }: ChatProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // --- NEW: AUTO SCROLL LOGIC START ---
  // Jab bhi chatMessages change honge (new chat, new message, reply), ye niche scroll karega
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);
  // --- NEW: AUTO SCROLL LOGIC END ---

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
          setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
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

  const selectConversation = async (id: string) => {
    setActiveConversation(id);
    const convo = await getConversation(id);
    setChatMessages(convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` })));
  };

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content || !activeConversation) return;
    
    // 1. Input Box Clear & Reset Height
    if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.style.height = "auto";
    }

    // 2. OPTIMISTIC UPDATE
    const tempUserMsg: ChatMessage = { role: "user", content: content, id: "temp-user" };
    const tempAiMsg: ChatMessage = { role: "assistant", content: "...", id: "temp-ai" };

    // Jaise hi ye set hoga, upar wala useEffect automatically scroll down kar dega
    setChatMessages((prev) => [...prev, tempUserMsg, tempAiMsg]);

    try {
        // 3. Backend Call
        const convo = await sendMessage(activeConversation, content);
        
        // 4. Update with real messages
        const msgs = convo.messages.map((m: any, i: number) => ({ ...m, id: `msg-${i}` }));
        setChatMessages(msgs);
        
    } catch (error) {
        toast.error("Failed to send message");
    }
  };

  const handleNewChat = async () => {
    const convo = await createConversation();
    setConversations((prev) => [convo, ...prev]);
    setActiveConversation(convo._id);
    setChatMessages([]);
  };

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit();     
    }
  };

  const SidebarContent = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgb(17,29,39)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Avatar sx={{ mx: "auto", mt: 4, mb: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
          {auth?.user?.name?.charAt(0).toUpperCase()}
          {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ mx: 2, fontSize: "1.25rem", mb: 1, textAlign: "center", fontWeight: 600, color: "white" }}>
          You are talking to Skye
        </Typography>

        <Box sx={{ mt: 1, flex: 1, minHeight: 0, overflowY: "auto", px: 2 }}>
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
                background: activeConversation === c._id ? "rgba(0,255,252,0.2)" : "rgba(255,255,255,0.05)",
                "&:hover": { background: "rgba(0,255,252,0.15)" },
              }}
            >
              <Typography fontSize="0.9rem" noWrap>{c.title}</Typography>
            </Box>
          ))}
        </Box>

        <Button onClick={handleNewChat} sx={{ height: "40px", color: "white", background: "rgba(0,255,252,0.2)", mt: 2, mx: "20px", borderRadius: 3 }}>
          + New Chat
        </Button>
        <Button onClick={handleDeleteChat} sx={{ height: "40px", color: "white", background: "rgba(255,20,0,0.6)", mt: 1, mb: 3, mx: "20px", borderRadius: 3, "&:hover": { bgcolor: red[900] } }}>
          <DeleteOutlineIcon sx={{ fontSize: 18, mr: 1 }} /> CLEAR
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100dvh - 70px)", 
        position: "relative",
        overflow: "hidden", 
      }}
    >
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        PaperProps={{
          sx: {
            bgcolor: "rgb(17,29,39)",
            border: "none",
            height: "calc(100dvh - 70px)",
            top: "70px", 
          },
        }}
      >
        {SidebarContent}
      </Drawer>

      <Box
  sx={{
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100%",
    minWidth: 0,          // 🔥 allow shrinking
    minHeight: 0,        // 🔥 allow vertical flex
    overflow: "hidden", // 🔥 prevent body scroll
    px: { xs: 1, sm: 3 }, // ✅ use padding instead of margin
    pb: 2,
  }}
>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "20px", md: "30px" },
            color: "white",
            mt: 2,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Gemini-2.0-Flash
        </Typography>

        {/* Chat Messages Area */}
        <Box
          ref={chatAreaRef}
          sx={{
            flex: 1, 
            overflowY: "auto", 
            minHeight: 0,
            borderRadius: 3,
            mt:2,
            mb: 2,
            "::-webkit-scrollbar": { width: "8px" },
            "::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: "10px" },
          }}
        >
          {chatMessages.map((chat, i) => (
            <ChatItem
              key={i}
              content={chat.content}
              role={chat.role}
              id={chat.id || `msg-${i}`}
            />
          ))}
        </Box>

        {/* Input Box */}
        <Box
          sx={{
            width: "100%",
            borderRadius: "15px",
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            alignItems: "flex-end", // Align bottom
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
            overflow: "hidden" 
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Ask anything..."
            style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "18px",
                resize: "none",
                fontFamily: "inherit",
                maxHeight: "150px", // Scroll limit
                overflowY: "auto",
                padding: "5px 10px",
                lineHeight: "1.5"
            }}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto"; 
                target.style.height = `${target.scrollHeight}px`; 
            }}
            onKeyDown={handleKeyDown}
          />
          
          <IconButton onClick={handleSubmit} sx={{ color: "white", mb: "4px" }}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;