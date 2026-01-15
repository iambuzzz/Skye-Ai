import { Box, Typography, Avatar, Divider, Link, Tooltip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import logocopy from "../../assets/logocopy.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

export const ChatItem = ({ content, role, id }: { content: string; role: "user" | "assistant"; id: string }) => {
  const auth = useAuth();
  const [copied, setCopied] = useState(false);

  const components = {
    p: (props: any) => <Typography sx={{ my: 1.5, fontSize: "1.1rem" }} {...props} />,

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
              {String(children)}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return <code>{children}</code>;
    },
  };

  return role === "assistant" ? (
    <Box sx={{ display: "flex", p: 2, gap: 2 }} id={id}>
      <Avatar><img src={logocopy} width="30" /></Avatar>
      <Box sx={{ color: "white" }}>
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", p: 2, gap: 2 }} id={id}>
      <Avatar>{auth?.user?.name?.charAt(0)}</Avatar>
      <Typography color="white">{content}</Typography>
    </Box>
  );
};
