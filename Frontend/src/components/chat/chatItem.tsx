import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import logocopy from "../../assets/logocopy.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

type Props = {
  content: string;
  role: "user" | "assistant";
  id: string;
};

export const ChatItem = ({ content, role, id }: Props) => {
  const auth = useAuth();
  const [copied, setCopied] = useState(false);

  const components = {
    p: (props: any) => (
      <Typography sx={{ my: 1.2, fontSize: "1.05rem" }} {...props} />
    ),

    code({ className, children }: any) {
      const match = /language-(\w+)/.exec(className || "");

      if (match) {
        return (
          <Box sx={{ position: "relative", my: 2 }}>
            <Tooltip title={copied ? "Copied" : "Copy"}>
              <Box
                onClick={() => {
                  navigator.clipboard.writeText(String(children));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "white" },
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>

            <SyntaxHighlighter style={coldarkDark} language={match[1]}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return (
        <code
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          {children}
        </code>
      );
    },
  };

  return role === "assistant" ? (
    <Box sx={{ display: "flex", gap: 2, p: 2 }} id={id}>
      <Avatar sx={{ bgcolor: "rgb(2,58,68)" }}>
        <img src={logocopy} width={30} />
      </Avatar>
      <Box sx={{ color: "white", width: "100%" }}>
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", gap: 2, p: 2 }} id={id}>
      <Avatar>{auth.user?.name.charAt(0)}</Avatar>
      <Typography color="white">{content}</Typography>
    </Box>
  );
};
