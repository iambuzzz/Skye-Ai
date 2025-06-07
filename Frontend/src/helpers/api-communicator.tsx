import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const signupUser = async (name:string, email: string, password: string) => {
  
    const response = await axios.post(`/user/signup`, {
      name,
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Signup failed!");
    }

   const data = await response.data;
   return data;

}

export const loginUser = async (email: string, password: string) => {
  
    const response = await axios.post(`/user/login`, {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Login failed!");
    }

   const data = await response.data;
   return data;

}




export const checkAuthStatus = async () => { 
    const response = await axios.get(`/user/auth-status`);
    if (response.status !== 200) {
      throw new Error("Unable to Authenticate!");
    }
   const data = await response.data;
   return data;
  
}


export const sendChatRequest = async (message: string) => { 
  const response = await axios.post("/chat/new", { message});

  if (response.status !== 200) {
    throw new Error("Unable to send chat request!");
  }
  const data = await response.data;
  return data;
};

export const getUserChats = async () => { 
  const response = await axios.get("/chat/all-chats");

  if (response.status !== 200) {
    throw new Error("Unable to send chat request!");
  }
  const data = await response.data;
  return data;
};

export const deleteUserChats = async () => { 
  const response = await axios.delete("/chat/delete");

  if (response.status !== 200) {
    throw new Error("Unable to delete chat!");
  }
  const data = await response.data;
  return data;
};

export const logoutUser = async () => { 
  const response = await axios.get("/user/logout");

  if (response.status !== 200) {
    throw new Error("Unable to logout!");
  }
  const data = await response.data;
  return data;
};

