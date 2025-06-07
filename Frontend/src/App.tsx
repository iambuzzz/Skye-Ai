import Header from "./components/Header"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
function App() {
  const auth = useAuth();
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {auth?.isLoggedIn && auth?.user && (<Route path="/chat" element={<Chat />} />)}
        <Route path="/logout" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<div><Signup /></div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </main>
  );
}

export default App;
