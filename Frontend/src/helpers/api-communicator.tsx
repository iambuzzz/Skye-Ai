import axios from "axios";


export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post(`/user/signup`, { name, email, password });
  if (res.status !== 201) throw new Error("Signup failed");
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`/user/login`, { email, password });
  if (res.status !== 200) throw new Error("Login failed");
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get(`/user/auth-status`);
  if (res.status !== 200) throw new Error("Auth failed");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get(`/user/logout`);
  if (res.status !== 200) throw new Error("Logout failed");
  return res.data;
};

export const createConversation = async () => {
  const res = await axios.post("/chat/new");
  if (res.status !== 201) throw new Error("Failed to create chat");
  return res.data;
};

export const getConversations = async () => {
  const res = await axios.get("/chat/list");
  if (res.status !== 200) throw new Error("Failed to load conversations");
  return res.data;
};

export const getConversation = async (id: string) => {
  const res = await axios.get(`/chat/${id}`);
  if (res.status !== 200) throw new Error("Failed to load chat");
  return res.data;
};

export const sendMessage = async (id: string, message: string) => {
  const res = await axios.post(`/chat/${id}`, { message });
  if (res.status !== 200) throw new Error("Message failed");
  return res.data;
};

export const deleteConversation = async (id: string) => {
  const res = await axios.delete(`/chat/${id}`);
  if (res.status !== 200) throw new Error("Delete failed");
  return res.data;
};
