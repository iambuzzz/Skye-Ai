import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from "@mui/material"
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

// --- IMPORTANT CHANGE HERE ---
// Access the environment variable
const backendBaseURL = import.meta.env.VITE_BACKEND_URL;

// Set the Axios default base URL using the environment variable
axios.defaults.baseURL = backendBaseURL;
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography:{
    fontFamily:"Roboto Slab, serif",
    allVariants:{color:"white"},
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
      <Toaster position='top-center' reverseOrder={false} />
        <App />
      </ThemeProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)