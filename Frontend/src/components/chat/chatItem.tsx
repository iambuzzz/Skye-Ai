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
      <Typography sx={{ my: 1.5, fontSize: "1.1rem" }} {...props} />
    ),
    ol: (props: any) => <ol style={{ paddingLeft: 20 }} {...props} />,
    ul: (props: any) => <ul style={{ paddingLeft: 20 }} {...props} />,
    li: (props: any) => (
      <li style={{ marginBottom: 10 }}>
        <Typography component="span" {...props} />
      </li>
    ),

    code({ className, children }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeText = String(children).replace(/\n$/, "");

      if (match) {
        return (
          <Box
            sx={{
              my: 2,
              width: "100%",
              position: "relative",
              "&:hover .copy-btn": { opacity: 1 },
            }}
          >
            <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
              <Box
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(codeText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  cursor: "pointer",
                  opacity: 0,
                  transition: "0.2s",
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "#fff" },
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
                borderRadius: 8,
                padding: "1rem",
                background:
                  "radial-gradient(circle at center,rgba(10,1,1,.25) 0%,rgba(68,65,65,.2) 50%,rgba(20,19,19,.15) 100%)",
                boxShadow: "0 0 10px rgba(61,116,139,.5)",
                border: "2px solid rgba(61,116,139,.41)",
                overflowX: "auto",
              }}
            >
              {codeText}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return (
        <Typography
          component="code"
          sx={{
            backgroundColor: "rgba(144,144,144,0.2)",
            px: "6px",
            py: "2px",
            borderRadius: "4px",
            fontFamily: '"Fira Code", monospace',
            fontSize: "0.9rem",
            wordBreak: "break-word",
          }}
        >
          {children}
        </Typography>
      );
    },

    blockquote: (props: any) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: "4px solid #00fffc",
          pl: 2,
          my: 2,
          fontStyle: "italic",
          color: "#9aa",
        }}
        {...props}
      />
    ),

    hr: () => <Divider sx={{ my: 3 }} />,
    a: (props: any) => <Link {...props} target="_blank" />,
  };

  return role === "assistant" ? (
    <Box
      id={id}
      sx={{
        display: "flex",
        p: 2,
        my: 1,
        gap: 2,
        pr: 4,
        background:
          "linear-gradient(90deg,rgba(13,37,62,.6) 0%,rgba(206,207,207,.1) 50%,rgba(13,37,62,.3) 100%)",
      }}
    >
      <Avatar sx={{ bgcolor: "rgb(2,58,68)" }}>
        <img src={logocopy} width={32} />
      </Avatar>

      <Box sx={{ color: "white", width: "100%" }}>
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </Box>
    </Box>
  ) : (
    <Box
      id={id}
      sx={{
        display: "flex",
        p: 2,
        gap: 2,
        my: 1,
        borderRadius: "8px",
        background:
          "radial-gradient(circle at center, rgba(0,255,252,.2) 0%, rgba(0,255,252,.3) 50%)",
      }}
    >
      <Avatar sx={{ bgcolor: "black" }}>
        {auth?.user?.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Typography color="white" fontSize="1.1rem">
        {content}
      </Typography>
    </Box>
  );
};
