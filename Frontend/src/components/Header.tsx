import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; 
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
import { useLocation, Link } from "react-router-dom"; 
import ChatIcon from '@mui/icons-material/Chat';      
import LogoutIcon from '@mui/icons-material/Logout';    

type HeaderProps = {
  handleSidebarToggle: () => void;
};

const Header = ({ handleSidebarToggle }: HeaderProps) => {
  const location = useLocation();
  const auth = useAuth();
  
  const isChatRoute = location.pathname.includes('/chat');

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'rgba(13, 37, 62, 0.24)', 
        backdropFilter: 'blur(10px)', 
        boxShadow: "0px 1px 1px rgba(41, 177, 226, 0.2)", 
        height: "70px", 
        display: "flex", 
        
        // Mobile pe Chat route ho to 0 padding, warna 2. Desktop pe hamesha 2.
        px: { xs: isChatRoute ? 0 : 2, sm: 2 } 
      }}
    >
      
      <Toolbar 
        disableGutters 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems:"center", 
          height:"100%",
          px: 0 
        }}
      >
        
        {/* Left Side: Icon + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {auth?.isLoggedIn && isChatRoute && (
            <IconButton 
              onClick={handleSidebarToggle} 
              sx={{ color: "white", display: { xs: "flex", md: "none" } }} 
            >
              <ChevronRightIcon /> 
            </IconButton>
          )}
          
          {auth?.isLoggedIn && isChatRoute && (
             <IconButton onClick={handleSidebarToggle} sx={{ color: "white", display: { xs: "none", md: "flex" } }}>
                <ChevronRightIcon />
             </IconButton>
          )}

          <Logo />
        </Box>

        {/* Right Side: Navigation */}
        <Box>
          {auth?.isLoggedIn ? (
            <>
              {/* --- DESKTOP VIEW (Bade Buttons) --- */}
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, alignItems: "center" }}>
                {!isChatRoute && (
                  <NavigationLink 
                    bg="#00fffc" 
                    to="/chat" 
                    text="Go To Chat" 
                    textcolor="black"
                    onClick={async () => {}}
                  />
                )}
                <NavigationLink 
                  to="/" 
                  bg="#51538f" 
                  text="Logout" 
                  textcolor="white" 
                  onClick={auth.logout}
                />
              </Box>

              {/* --- MOBILE VIEW (Icons Only) --- */}
              <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 1, alignItems: "center" }}>
                {!isChatRoute && (
                  <Link to="/chat">
                    <IconButton sx={{ color: "#00fffc" }}>
                       <ChatIcon />
                    </IconButton>
                  </Link>
                )}
                <IconButton onClick={auth.logout} sx={{ color: "white" }}>
                   <LogoutIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            // Logout state (Sign In / Sign Up)
            <Box sx={{ display: "flex", gap: 1 }}>
              <NavigationLink to="/login" bg="#00fffc" text="Login" textcolor="black" onClick={async () => {}} />
              <NavigationLink to="/signup" bg="#51538f" text="SignUp" textcolor="white" onClick={async () => {}} />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;