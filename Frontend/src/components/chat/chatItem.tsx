import { Box, Typography, Avatar, Divider, Link } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import logocopy from "../../assets/logocopy.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Copy failed", err);
  }
};

const LoadingDots = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: "24px" }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: "8px",
            height: "8px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: `${i * 0.16}s`,
            "@keyframes bounce": {
              "0%, 80%, 100%": { transform: "scale(0)" },
              "40%": { transform: "scale(1)" },
            },
          }}
        />
      ))}
    </Box>
  );
};

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
  const isLoading = content === "...";
  const [copied, setCopied] = useState(false);

  const components = {
    h1: (props: any) => <Typography variant="h4" gutterBottom {...props} />,
    h2: (props: any) => <Typography variant="h5" gutterBottom {...props} />,
    h3: (props: any) => <Typography variant="h6" gutterBottom {...props} />,
    p: (props: any) => (
      <Typography
        variant="body1"
        sx={{
          my: 1.5,
          fontSize: "1.1rem",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
        {...props}
      />
    ),
    ol: (props: any) => <ol style={{ paddingLeft: "20px" }} {...props} />,
    ul: (props: any) => <ul style={{ paddingLeft: "20px" }} {...props} />,
    li: (props: any) => (
      <li style={{ marginBottom: "10px" }}>
        <Typography component="span" variant="body1" {...props} />
      </li>
    ),

    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (match) {
        return (
          <Box
  sx={{
    my: 2,
    width: "100%",
    maxWidth: "100%",
    position: "relative",
    overflow: "hidden",
  }}
>

            <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
  <Box
    className="copy-btn"
    onClick={() => {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }}
    sx={{
      position: "absolute",
      top: 8,
      right: 8,
      cursor: "pointer",
      opacity: 1,
      transition: "0.2s",
      color: "rgba(255,255,255,0.6)",
      "&:hover": { color: "#fff" },
      zIndex: 10,
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
                maxWidth: "100%",
                overflowX: "auto",         // 🔑 horizontal scroll instead of expanding
                background:
                  "radial-gradient(circle at center,rgba(10,1,1,0.26) 0%,rgba(68,65,65,0.23) 50%,rgba(20,19,19,0.17) 100%)",
                boxShadow: "0 0px 10px rgba(61,116,139,0.5)",
                border: "2px solid rgba(61,116,139,0.41)",
              }}
              codeTagProps={{
                style: {
                  fontFamily: '"Fira Code", monospace',
                  whiteSpace: "pre-wrap",     // 🔑 allow wrapping
                  wordBreak: "break-word",    // 🔑 break long tokens
                  overflowWrap: "anywhere",
                  fontSize: "13px",
                },
              }}
              {...props}
            >
              {codeString}
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
            fontSize: "0.9rem",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
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
          borderLeft: "4px solid",
          borderColor: "primary.main",
          paddingLeft: 2,
          margin: 2,
          fontStyle: "italic",
          color: "grey.400",
        }}
        {...props}
      />
    ),
    hr: (props: any) => <Divider sx={{ my: 3 }} {...props} />,
    a: (props: any) => (
      <Link {...props} target="_blank" rel="noopener noreferrer" />
    ),
  };

  return role === "assistant" ? (
    <Box
      id={id}
      sx={{
        display: "flex",
        padding: 2,
        my: 1,
        gap: 2,
        pr: 2,
        minWidth: 0,          // 🔑 flex shrink allowed
        background:
          "linear-gradient(90deg,rgba(13,37,62,0.6) 0%,rgba(206,207,207,0.1) 50%,rgba(13,37,62,0.3) 100%)",
      }}
    >
      <Avatar sx={{ bgcolor: "rgb(2,58,68)", mt: "6px", flexShrink: 0 }}>
        <img src={logocopy} width="35px" alt="bot" />
      </Avatar>

      <Box
        sx={{
          color: "white",
          width: "100%",
          minWidth: 0,      // 🔑 VERY IMPORTANT
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      id={id}
      sx={{
        display: "flex",
        padding: 2,
        gap: 2,
        my: 1,
        minWidth: 0,
        borderRadius: "8px",
        background:
          "radial-gradient(circle at center, rgba(0,255,252,0.2) 0%, rgba(0,255,252,0.3) 50%)",
      }}
    >
      <Avatar sx={{ bgcolor: "black", flexShrink: 0 }}>
        {auth?.user?.name?.charAt(0).toUpperCase()}
        {auth?.user?.name?.split(" ")[1]?.charAt(0).toUpperCase()}
      </Avatar>

      <Typography
        color="white"
        fontSize="1.1rem"
        sx={{
          minWidth: 0,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};
