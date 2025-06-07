import User from "../models/user.js";
import {NextFunction, Request, Response} from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

// Make sure dotenv config is loaded, likely in app.ts, but good to ensure
// import { config } from "dotenv";
// config(); // If not already in app.ts, you might need it here for process.env

const domain = process.env.NODE_ENV === "production"
    ? process.env.COOKIE_DOMAIN || ".onrender.com" // For Render, use .onrender.com or your custom domain
    : "localhost";

const secureCookie = process.env.NODE_ENV === "production"; // Only secure in production (HTTPS)


export const getAllUsers = async (req:Request, res:Response, next:NextFunction) =>{
    // ... (no changes needed here)
}

export const userSignup = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {name,email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(401).send("User already registered!");
        const hashedPassword = await hash(password,10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        // Create token and store cookie
        res.clearCookie(COOKIE_NAME,{
            path:"/",
            domain: domain, // Use dynamic domain
            httpOnly:true,
            signed:true,
            secure: secureCookie, // Add secure flag
        });

        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(COOKIE_NAME,token, {
            path:"/",
            domain: domain, // Use dynamic domain
            expires,
            httpOnly:true,
            signed:true,
            secure: secureCookie, // Add secure flag
        });
        return res.status(200).json({message:"OK", name:user.name, email:user.email, id:user._id.toString()});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
    }
}

export const userLogin = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not registered!");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password!");
        }

        // Clear cookie with dynamic domain and secure flag
        res.clearCookie(COOKIE_NAME,{
            path:"/",
            domain: domain, // Use dynamic domain
            httpOnly:true,
            signed:true,
            secure: secureCookie, // Add secure flag
        });

        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // Set cookie with dynamic domain and secure flag
        res.cookie(COOKIE_NAME,token, {
            path:"/",
            domain: domain, // Use dynamic domain
            expires,
            httpOnly:true,
            signed:true,
            secure: secureCookie, // Add secure flag
        });
        return res.status(200).json({message:"OK", name:user.name, email:user.email, id:user._id.toString()});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
    }
}

export const verifyUser = async (req:Request, res:Response, next:NextFunction) =>{
    // ... (no changes needed here, as the cookie parsing happens before this)
}

export const userLogout = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        // Clear cookie with dynamic domain and secure flag
        res.clearCookie(COOKIE_NAME,{
            path:"/",
            domain: domain, // Use dynamic domain
            httpOnly:true,
            signed:true,
            secure: secureCookie, // Add secure flag
        });
        return res.status(200).json({message:"OK"});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
    }
}
