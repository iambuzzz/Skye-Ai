import { Box, Typography, Avatar, Divider, Link, Tooltip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import logocopy from "../../assets/logocopy.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

export const ChatItem = ({
  content,
  role,
  id,
}: {
  content: string;
  role: "user" | "assistant";
  id: string;
}) => {
  const auth = useAuth();
  const [copied, setCopied] = useState(false);

  const components = {
    h1: (props: any) => <Typography variant="h4" gutterBottom {...props} />,
    h2: (props: any) => <Typography variant="h5" gutterBottom {...props} />,
    h3: (props: any) => <Typography variant="h6" gutterBottom {...props} />,
    p: (props: any) => (
      <Typography variant="body1" sx={{ my: 1.5, fontSize: "1.1rem" }} {...props} />
    ),
    ol: (props: any) => <ol style={{ paddingLeft: "20px" }} {...props} />,
    ul: (props: any) => <ul style={{ paddingLeft: "20px" }} {...props} />,
    li: (props: any) => (
      <li style={{ marginBottom: "10px" }}>
        <Typography component="span" variant="body1" {...props} />
      </li>
    ),
    code({ className, children }: any) {
      const match = /language-(\w+)/.exec(className || "");

      if (match) {
        return (
          <Box
            sx={{
              my: 2,
              width: "100%",
              overflowX: "auto",
              position: "relative",
              "&:hover .copy-btn": { opacity: 1 },
            }}
          >
            <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
              <Box
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(String(children).trim());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  cursor: "pointer",
                  opacity: 0,
                  transition: "0.2s",
                  color: "rgba(255,255,255,0.5)",
                  "&:hover": { color: "white" },
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>

            <SyntaxHighlighter
              style={coldarkDark}
              language={match[1]}
              PreTag="div"
              customStyle={{
                borderRadius: "8px",
                padding: "1rem",
                margin: "0",
                background:
                  "radial-gradient(circle at center,rgba(10,1,1,0.25) 0%,rgba(68,65,65,0.2) 50%,rgba(20,19,19,0.15) 100%)",
                boxShadow: "0 0px 10px rgba(61, 116, 139, 0.5)",
                border: "2px solid rgba(61, 116, 139, 0.41)",
                overflowX: "auto",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return (
        <Typography
          component="code"
          sx={{
            backgroundColor: "rgba(144,144,144,0.2)",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
            fontFamily: '"Fira Code", monospace',
          }}
        >
          {children}
        </Typography>
      );
    },
    hr: (props: any) => <Divider sx={{ my: 3 }} {...props} />,
    a: (props: any) => <Link {...props} target="_blank" />,
  };

  return role === "assistant" ? (
    <Box sx={{ display: "flex", padding: 2, gap: 2 }} id={id}>
      <Avatar sx={{ bgcolor: "rgb(2,58,68)" }}>
        <img src={logocopy} width="32px" />
      </Avatar>
      <Box sx={{ color: "white", width: "100%" }}>
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", padding: 2, gap: 2 }} id={id}>
      <Avatar sx={{ bgcolor: "black" }}>
        {auth?.user?.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Typography color="white">{content}</Typography>
    </Box>
  );
};
