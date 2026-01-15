import axios from "axios";

axios.defaults.withCredentials = true;

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  return res.data;
};


export const createConversation = async () => {
  const res = await axios.post("/chat/new");
  return res.data;      
};

export const getConversations = async () => {
  const res = await axios.get("/chat/list");
  return res.data;    
};

export const getConversation = async (id: string) => {
  const res = await axios.get(`/chat/${id}`);
  return res.data;       
};

export const sendMessage = async (id: string, message: string) => {
  const res = await axios.post(`/chat/${id}`, { message });
  return res.data;   
};

export const deleteConversation = async (id: string) => {
  const res = await axios.delete(`/chat/${id}`);
  return res.data;
};
