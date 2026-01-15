import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import { useState } from "react"; // 1. useState import karna zaroori hai

function App() {
  const auth = useAuth();
  
  // 2. State banayi jo track karegi ki sidebar khula hai ya band
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 3. Toggle function
  const handleSidebarToggle = () => {
    // Console check: Inspect element -> Console mein ye message aana chahiye
    console.log("Button clicked! New State:", !drawerOpen); 
    setDrawerOpen((prev) => !prev);
  };

  return (
    <main>
      {/* 4. Header ko function pass kiya taaki button daba sakein */}
      <Header handleSidebarToggle={handleSidebarToggle} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 5. Sabse Important: Chat component ko 'drawerOpen' state pass karni hai */}
        {auth?.isLoggedIn && auth?.user && (
          <Route 
            path="/chat" 
            element={<Chat drawerOpen={drawerOpen} />} 
          />
        )}
        
        <Route path="/logout" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<div><Signup /></div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </main>
  );
}

export default App;