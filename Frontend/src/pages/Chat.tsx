import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { ChatItem } from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";

type Msg = { role: "user" | "assistant"; content: string; id: string };

const Chat = () => {
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    getUserChats().then(res => {
      const withIds = res.chats.map((c: any, i: number) => ({ ...c, id: "msg-" + i }));
      setMessages(withIds);
    });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const send = async () => {
    const text = inputRef.current?.value;
    if (!text) return;

    inputRef.current.value = "";

    const res = await sendChatRequest(text);
    const withIds = res.chats.map((c: any, i: number) => ({ ...c, id: "msg-" + i }));
    setMessages(withIds);

    setTimeout(() => scrollTo(withIds[withIds.length - 1].id), 100);
  };

  const userMessages = messages.filter(m => m.role === "user");

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      {/* LEFT SIDEBAR */}
      <Box sx={{ width: "20%", p: 2, background: "#111d27" }}>
        <Avatar sx={{ mx: "auto", mb: 2 }}>
          {auth.user?.name.charAt(0)}
        </Avatar>

        <Button fullWidth sx={{ mb: 2 }} onClick={() => chatAreaRef.current?.scrollTo({ top: 0 })}>
          + New Chat
        </Button>

        <Box sx={{ overflowY: "auto", maxHeight: "70%" }}>
          {userMessages.map((m, i) => (
            <Box
              key={i}
              onClick={() => scrollTo("msg-" + i * 2)}
              sx={{ p: 1, mb: 1, bgcolor: "rgba(255,255,255,0.05)", cursor: "pointer" }}
            >
              {m.content.slice(0, 30)}…
            </Box>
          ))}
        </Box>

        <Button color="error" fullWidth onClick={deleteUserChats}>Clear Conversation</Button>
      </Box>

      {/* CHAT */}
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <Box ref={chatAreaRef} sx={{ flex: 1, overflowY: "auto" }}>
          {messages.map(m => <ChatItem key={m.id} {...m} />)}
        </Box>

        <Box sx={{ display: "flex" }}>
          <textarea ref={inputRef} style={{ flex: 1 }} />
          <IconButton onClick={send}><IoMdSend /></IconButton>
        </Box>
      </Box>

    </Box>
  );
};

export default Chat;
