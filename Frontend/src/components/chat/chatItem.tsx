import React from "react";
import { Box, Typography, Avatar, Divider, Link } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import logocopy from "../../assets/logocopy.png";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ChatItem = ({ content, role, id }: { content: string; role: "user" | "assistant", id: string }) => {
    const auth = useAuth();

    const components = {
        h1: (props: React.PropsWithChildren<{}>) => <Typography variant="h4" gutterBottom {...props} />,
        h2: (props: React.PropsWithChildren<{}>) => <Typography variant="h5" gutterBottom {...props} />,
        h3: (props: React.PropsWithChildren<{}>) => <Typography variant="h6" gutterBottom {...props} />,
        p: (props: React.PropsWithChildren<{}>) => <Typography variant="body1" sx={{ my: 1.5, fontSize: "1.25rem" }} {...props} />, // Responsive font size
        ol: (props: React.PropsWithChildren<{}>) => <ol style={{ paddingLeft: '20px' }} {...props} />,
        ul: (props: React.PropsWithChildren<{}>) => <ul style={{ paddingLeft: '20px' }} {...props} />,
        li: (props: React.PropsWithChildren<{}>) => (
            <li style={{ marginBottom: '10px' }}>
                <Typography component="span" variant="body1" {...props} />
            </li>
        ),
        code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            if (match) {
                return (
                    <Box sx={{ my: 2, width: '100%', overflowX: 'auto' }}> {/*  Allow horizontal scrolling for very long code blocks */}
                        <SyntaxHighlighter
                            style={coldarkDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                                borderRadius: '8px',
                                padding: '1rem',
                                margin: '0',
                                background: 'radial-gradient(circle at center,rgba(10, 1, 1, 0.26) 0%,rgba(68, 65, 65, 0.23) 50%,rgba(20, 19, 19, 0.17) 100%)',
                                boxShadow: '0 0px 10px rgba(61, 116, 139, 0.5)',
                                border: '2px solid rgba(61, 116, 139, 0.41)',
                                color: '#ffffff',
                                overflowX: 'auto',  // Ensure scrollbar if needed
                            }}
                            codeTagProps={{
                                style: {
                                    fontFamily: '"Fira Code", monospace',
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-all", // Break long lines of code
                                    fontSize: '14px',
                                    color: 'inherit',
                                },
                            }}
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    </Box>
                );
            }

            return (
                <Typography
                    component="code"
                    sx={{
                        backgroundColor: 'rgba(144, 144, 144, 0.2)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: '"Fira Code", monospace',
                        fontSize: '0.9rem', // Responsive font size
                        wordBreak: 'break-word',
                    }}
                    {...props}
                >
                    {children}
                </Typography>
            );
        },
        blockquote: (props: React.PropsWithChildren<{}>) => (
            <Box
                component="blockquote"
                sx={{
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    paddingLeft: 2,
                    margin: 2,
                    fontStyle: 'italic',
                    color: 'grey.400'
                }}
                {...props}
            />
        ),
        hr: (props: React.PropsWithChildren<{}>) => <Divider sx={{ my: 3 }} {...props} />,
        a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <Link {...props} target="_blank" rel="noopener noreferrer" />,
    };

    return role === "assistant" ? (
        <Box sx={{
            display: "flex",
            padding: 2,
            bgcolor: "transparent",
            my: 1,
            gap: 2,
            pr: 4,
            background: "linear-gradient(90deg,rgba(13, 37, 62, 0.6) 0%,rgba(206, 207, 207, 0.1) 50%,rgba(13, 37, 62, 0.3) 100%)",
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
        }} id={id}>
            <Avatar sx={{ ml: 0, bgcolor: "rgb(2,58,68)", color: "white", paddingTop: "5px", mt: "6px" }}>
                <img src={logocopy} alt="assistant-avatar" width={"35px"} />
            </Avatar>
            <Box sx={{ color: "white", width: '100%', overflow: 'hidden', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <ReactMarkdown components={components}>
                    {content}
                </ReactMarkdown>
            </Box>
        </Box>
    ) : (
        <Box sx={{
            display: "flex",
            padding: 2,
            background: "radial-gradient(circle at center, rgba(0,255,252, 0.2) 0%, rgba(0,255,252, 0.3) 50%, rgba(0,255,252, 0.2) 75%, rgba(0,255,252, 0.3) 100%)",
            gap: 2,
            my: 1,
            borderRadius: '8px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
        }} id={id}>
            <Avatar sx={{ ml: 0, bgcolor: "black", color: "white" }}>
                {auth?.user?.name?.charAt(0).toUpperCase()}
                {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
                <Typography variant="body1" color="white" fontSize={"1.25rem"} paddingTop={0.4}>{content}</Typography> {/* Responsive font size */}
            </Box>
        </Box>
    );
};