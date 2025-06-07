import React, {useEffect } from "react";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try {
            if (!auth) {
                throw new Error("Authentication context is not available");
            }
            toast.loading("Signing up...", {id:"signup"});
            await auth.signup(name, email, password);
            toast.dismiss("signup");
            toast.success("Signup successful!", {id:"signup"});
            navigate("/chat");
        } catch (error) {
            console.error(error);
            toast.dismiss("signup");
            toast.error("Signing up failed!", {id:"signup"});
        }
    }
    useEffect(() => {
      if(auth?.user){
        return navigate("/chat");
      }
    }, [auth]) 
  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        backgroundColor: "#05101c",
        display: "flex",
        flex: 10,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 0, sm: 1, md: 1, lg: 3 },
      }}
    >
    <Box
      sx={{
        flex: 5,
        display: { xs: "none", md: "flex" },
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "600px",
        marginLeft: { xs: 0, sm: 1, md: 3, lg: 8 },
        // marginRight: { xs: 0, sm: 1, md: 3, lg: 4 },
        height: "500px"
      }}
    >
      <img 
        src="log1.png" 
        alt="AI ChatBot Logo" 
        style={{ 
          maxWidth: "60%", 
          marginTop: "10px",
          maxHeight: "auto",
          filter: "drop-shadow(0 0 10px rgba(2, 255, 242, 0.6))"
        }} 
      />
    </Box>
    <Box
        sx={{
            width: '1px',
            height: {md: '50%', lg: '70%'},
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: { xs: "none", md: "none", lg: "block" },
            boxShadow: '0 0 8px rgba(2, 255, 242, 0.36)',
            margin: '0px 80px 0px 10px'
        }}
    />
    <Box
      sx={{
        flex: 6,
        height: "90vh",
        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: { xs: 1, sm:2},
        mr: { xs: 1, sm:2, md: 8, lg:8 },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          borderRadius: "20px",
          border: "1px solid rgba(59, 55, 55, 0.12)",
          background: "rgba(127, 121, 121, 0.09)",
          boxShadow: "0 0 10px rgba(2, 255, 242, 0.49)",
        //   backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          color: "#fff",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "600px",
          padding: { xs: '60px 40px', sm: '60px 40px', md: '50px 50px', lg: '50px 60px' }
        }}
      >
        <Typography
          variant="h4"
          fontWeight={400}
          color="#ffffff"
          textAlign="center"
          
        >
          Sign up
        </Typography>

        <Box
        component="input"
        type="text"
        name="name"
        placeholder="Name"
        sx={{
          padding: "16px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          background: "rgba(152, 149, 149, 0.06)",
          fontSize: "16px",
          color: "#fff",
          width: "100%",
          outline: "none",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          "&:focus": {
            borderRadius: "0px", // Changed from 10px to 20px
            borderImage: "linear-gradient(to right, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2", // Changed from 1 to 2 for thicker gradient
            animation: "rotate 2s linear infinite",
            "@keyframes rotate": {
              "0%": {
            borderImage: "linear-gradient(0deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              },
              "100%": {
            borderImage: "linear-gradient(360deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              }
            }
          }
        }}
        />

        <Box
        component="input"
        type="email"
        name="email"
        placeholder="Email"
        sx={{
          padding: "16px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          background: "rgba(152, 149, 149, 0.06)",
          fontSize: "16px",
          color: "#fff",
          width: "100%",
          outline: "none",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          "&:focus": {
            borderRadius: "0px", // Changed from 10px to 20px
            borderImage: "linear-gradient(to right, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2", // Changed from 1 to 2 for thicker gradient
            animation: "rotate 2s linear infinite",
            "@keyframes rotate": {
              "0%": {
            borderImage: "linear-gradient(0deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              },
              "100%": {
            borderImage: "linear-gradient(360deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              }
            }
          }
        }}
        />
        <Box
        component="input"
        type="password"
        name="password"
        placeholder="Password"
    
        sx={{
          padding: "16px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          background: "rgba(152, 149, 149, 0.06)",
          fontSize: "16px",
          color: "#fff",
          width: "100%",
          outline: "none",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          "&:focus": {
            borderRadius: "0px",
            borderImage: "linear-gradient(to right, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2",
            animation: "rotate 1s linear infinite",
            "@keyframes rotate": {
              "0%": {
                borderImage: "linear-gradient(0deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              },
              "100%": {
                borderImage: "linear-gradient(360deg, #02FFF2, #4facfe, #00f2fe, #02FFF2) 2"
              }
            }
          }
        }}
        />

        <Box
        component="button"
        type="submit"
        sx={{
          padding: "16px",
        //   backgroundColor: "rgba(255, 255, 255, 0.93)",
          backgroundColor: "rgba(2, 255, 242, 0.93)",

          fontSize: "16px",
          color: "#000",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          width: "100%",
          fontWeight: "600",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)", 
          paddingBottom: "20px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 0 20px rgba(2, 255, 242, 0.7)",
            
          }
        }}
        >
        Sign up
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default Signup;