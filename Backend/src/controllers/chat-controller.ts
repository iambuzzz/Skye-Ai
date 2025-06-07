import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { configureGemini } from "../config/gemini-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid or missing message." });
    }

    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Add the new message to history
    user.chats.push({ role: "user", content: message });

    const ai = configureGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // or "gemini-pro", "gemini-1.5-flash", etc.
      contents: message, // for basic message input
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ message: "No response from Gemini." });
    }

    // Save assistant reply
    user.chats.push({ role: "assistant", content: text });
    await user.save();

    return res.status(200).json({
      message: text,
      chats: user.chats,
    });
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
        return res.status(200).json({message:"Error", cause: error.message});
        
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
        return res.status(200).json({message:"Error", cause: error.message});
        
    }
}