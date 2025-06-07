import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

const Logo = () => {
  return (
    <div style={{ display: "flex", marginRight: "auto", alignItems: "center", gap: "8px" }}>
      <Link to="/">
        <img 
          src="logo.png" 
          alt="AI ChatBot Logo" 
          width={"35px"}
          height={"35px"}
          style={{ marginTop: "8px" }}
          className="image-inverted"
        />
      </Link>

      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography 
          sx={{ 
            display: { md: "block", sm: "block", xs: "none" }, 
            mr: "auto", 
            fontWeight: 800, 
            textShadow: "2px 2px 20px #000000" 
          }}
        >
          <span style={{ fontSize: "22px" }}>Skye-AI</span>
        </Typography>
      </Link>
    </div>
  );
};

export default Logo;
