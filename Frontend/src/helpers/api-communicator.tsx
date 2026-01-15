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


export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message });
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  return res.data;
};
