import React, { useEffect, useLayoutEffect, useRef, useCallback, useState } from 'react';
import { Box, Avatar, Typography, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { red } from '@mui/material/colors';
import { ChatItem } from "./../components/chat/chatItem";
import { IoMdSend } from 'react-icons/io';
import "./../index.css";
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type ChatMessage = { role: "user" | "assistant"; content: string; id?: string; };

const Chat = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [loading] = useState(false);

    // This is the function we need. It scrolls to the START of a specific message.
    const scrollToMessage = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSubmit = async () => {
        const content = inputRef.current?.value.trim();
        if (!content) return;

        const userMessage: ChatMessage = { role: "user", content, id: `user-${Date.now()}` };

        // Clear input and optimistically add the user's message.
        // The scroll for the user's message works correctly.
        if (inputRef.current) inputRef.current.value = "";
        resetTextareaHeight();
        setChatMessages((prev) => [...prev, userMessage]);
        setTimeout(() => scrollToMessage(userMessage.id!), 0);

        try {
            const chatData = await sendChatRequest(content);
            // ASSUMPTION: The API returns the full, updated list of messages.
            const fullChatHistory = chatData.chats;

            if (fullChatHistory && fullChatHistory.length > 0) {
                // Give every message a unique and predictable ID based on its index.
                const messagesWithIds = fullChatHistory.map((chat: ChatMessage, index: number) => ({
                    ...chat,
                    id: `msg-${index}`
                }));

                // The new AI message to scroll to is the last one in the list.
                const lastMessage = messagesWithIds[messagesWithIds.length - 1];

                // Update the state with the complete and correct list from the server.
                setChatMessages(messagesWithIds);

                // If the last message is from the assistant, scroll to the start of it.
                if (lastMessage && lastMessage.role === 'assistant') {
                    // We use a small timeout to ensure React has rendered the new element
                    // before we try to scroll to it.
                    setTimeout(() => {
                        scrollToMessage(lastMessage.id!);
                    }, 100);
                }
            }
        } catch (err) {
            toast.error("Sorry, could not get a response from the AI.");
            // If the API fails, remove the optimistic message we added.
            setChatMessages(prev => prev.filter(p => p.id !== userMessage.id));
            console.error("Chat API error:", err);
        }
    };

    const handleDeleteChat = async () => {
        try {
            toast.loading("Deleting chats...", { id: "deleting-chats" });
            await deleteUserChats();
            setChatMessages([]);
            toast.success("Chats deleted successfully!", { id: "deleting-chats" });
        } catch (error) {
            console.error("Error deleting chats:", error);
            toast.error("Failed to delete chats. Please try again.");
        }
    };

    const scrollToBottomOnLoad = useCallback(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, []);

    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            toast.loading("Loading chats...", { id: "loading-chats" });
            getUserChats().then((data) => {
                setChatMessages(data.chats || []);
                toast.success("Chats loaded successfully!", { id: "loading-chats" });
                // For the very first load, just go to the bottom.
                setTimeout(scrollToBottomOnLoad, 100);
            }).catch((err) => {
                console.error("Error fetching chats:", err);
                toast.error("Failed to load chats.");
            });
        }
    }, [auth, scrollToBottomOnLoad]);

    useEffect(() => {
        if (!auth?.isLoggedIn || !auth?.user) {
            toast.error("Please login to continue.");
            navigate("/login");
        }
    }, [auth, navigate]);

    const resetTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            if (inputRef.current.value) {
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
            } else {
                inputRef.current.rows = 1;
            }
        }
    };

    const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Box sx={{
            //... Your JSX is unchanged
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
                width: isMobile ? "100%" : "20%",
                flexDirection: "column",
                order: isMobile ? 2 : 1,
            }}>
                <Box sx={{
                    display: "flex",
                    width: "100%",
                    flex: 1,
                    mt: 0,
                    backgroundColor: "rgb(17,29,39)",
                    borderRadius: 5,
                    flexDirection: "column",
                    mx: 3,
                }}>
                    <Avatar sx={{
                        mx: "auto",
                        mt: 3,
                        mb: 2,
                        bgcolor: "white",
                        color: "black",
                        fontWeight: 700
                    }}>
                        {auth?.user?.name?.charAt(0).toUpperCase()}{auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{
                        mx: "auto",
                        fontFamily: "work sans",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "white",
                        px: 2,
                        textAlign: "center"
                    }}>
                        You are talking to Skye
                    </Typography>
                    <Typography sx={{
                        mx: "auto",
                        fontFamily: "work sans",
                        px: 2,
                        mt: 1,
                        textAlign: "center",
                        fontSize: "1rem"
                    }}>
                        You can ask me anything. I am here to help you with your queries.
                    </Typography>
                    <Button onClick={handleDeleteChat} sx={{
                        width: "auto",
                        height: "50px",
                        color: "white",
                        fontWeight: 700,
                        borderRadius: 3,
                        bgcolor: red[400],
                        padding: "10px 20px",
                        mt: "auto",
                        mb: 3,
                        lineHeight: "1.3",
                        marginLeft: "20px",
                        marginRight: "20px",
                        ":hover": {
                            bgcolor: red.A400,
                        }
                    }}
                    >
                        Clear Conversation
                    </Button>
                </Box>
            </Box>

            {/* Chat Area */}
            <Box sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                paddingLeft: isMobile ? 2 : 3,
                paddingRight: isMobile ? 2 : 2.2,
                height: "100%",
                order: isMobile ? 1 : 2,
            }}>
                <Typography sx={{
                    textAlign: "center",
                    fontSize: "1.75rem",
                    color: "white",
                    mt: 0,
                    mb: 2,
                    mx: "auto",
                    height: "7%",
                    textShadow:"1px 1px 10px #00fffc"
                }}>
                    Model - Gemini-AI
                </Typography>
                <Box
                    ref={chatAreaRef}
                    sx={{
                        width: "100%",
                        height: "80%",
                        mx: "auto",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                        scrollBehavior: "smooth",
                        mb: 2,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(0,0,0,0.1)',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.3)',
                            },
                        },
                    }}
                >
                    {chatMessages.map((chat, index) => {
                        return (
                            <ChatItem key={chat.id || index} content={chat.content} role={chat.role} id={chat.id || `msg-${index}`} />
                        );
                    })}
                    {loading && <Typography textAlign="center">Loading...</Typography>}
                </Box>

                {/* Chat Input */}
                <div className="chat-input-container">
                    <textarea
                        ref={inputRef}
                        className="chat-input custom-scroll"
                        placeholder="Ask anything..."
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height = Math.min(target.scrollHeight, 180) + "px";
                        }}
                        onKeyDown={handleTextareaKeyDown}
                    />
                    <IconButton onClick={handleSubmit} sx={{ color: "white", marginLeft: "10px" }}>
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
};

export default Chat;
