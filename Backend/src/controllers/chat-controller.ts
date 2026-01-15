import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { configureGemini } from "../config/gemini-config.js";

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid or missing message." });
    }

    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "User not found." });

    user.chats.push({ role: "user", content: message });

    // --- SDK FIX START ---
    const genAI = configureGemini(); 
    // Model name "gemini-1.5-flash" use karein stable quota ke liye
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    // Naya syntax: seedha model se call karein
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text(); // text property nahi, text() function hai
    // --- SDK FIX END ---

    if (!text) {
      return res.status(500).json({ message: "No response from Gemini." });
    }

    user.chats.push({ role: "assistant", content: text });
    await user.save();

    return res.status(200).json({ message: text, chats: user.chats });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "Something went wrong",
    });
  }
};

export const sendChatsToUser = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered!");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Token ID does not match user ID!");
        }
        
        return res.status(200).json({message:"OK", chats: user.chats});

    } catch (error) {
        console.log(error);
        // --- FIX ---
        // Was res.status(200), changed to 500
        return res.status(500).json({message:"Error", cause: error.message});
    }
}

export const deleteChats = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered!");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Token ID does not match user ID!");
        }
        user.chats.splice(0, user.chats.length); // Clear the chats array
        await user.save(); // Save the changes
        return res.status(200).json({message:"OK"});

    } catch (error) {
        console.log(error);
        // --- FIX ---
        // Was res.status(200), changed to 500
        return res.status(500).json({message:"Error", cause: error.message});
    }
}




