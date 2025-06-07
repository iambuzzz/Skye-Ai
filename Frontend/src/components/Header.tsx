import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const auth = useAuth();
  return (
    <header>
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(13, 37, 62, 0.24)', backdropFilter: 'blur(10px)', position: "static" , boxShadow: "0px 1px 1px rgba(41, 177, 226, 0.2)", height: "70px", display:"flex" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems:"center", height:"100%"}}>
          <Logo />
          <div>
            {auth?.isLoggedIn ? <>
            {location.pathname !== '/chat' && (
                <NavigationLink to="/chat" bg="#00fffc" text="Go to Chat" textcolor="black" onClick={async () => {}}  />
              )}
              
              <NavigationLink 
                to="/" 
                bg="#51538f" 
                text="Logout" 
                textcolor="white" 
                onClick={auth.logout}
              />

            </> : <>
              <NavigationLink to="/login" bg="#00fffc" text="Sign in" textcolor="black" onClick={async () => {}} />
              <NavigationLink to="/signup" bg="#51538f" text="Sign Up" textcolor="white" onClick={async () => {}} />
            </>}
          </div>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
