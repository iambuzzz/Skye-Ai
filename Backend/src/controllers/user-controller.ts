import User from "../models/user.js";
import {NextFunction, Request, Response} from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

// --- START: PRODUCTION-READY COOKIE CONFIGURATION ---

// Helper function to create cookie options based on the environment
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        path: "/",
        // In production, your frontend and backend are on different subdomains of .onrender.com
        // Setting the domain to ".onrender.com" allows the cookie to be shared between them.
        domain: isProduction ? ".onrender.com" : "localhost",
        // 'secure: true' is REQUIRED for 'sameSite: "none"'. It ensures the cookie is only sent over HTTPS.
        secure: isProduction,
        // 'sameSite: "none"' is necessary to allow the browser to send the cookie in a cross-site context
        // (i.e., from your frontend domain to your backend domain).
        sameSite: "none" as const,
        httpOnly: true,
        signed: true,
    };
};

// --- END: PRODUCTION-READY COOKIE CONFIGURATION ---

export const getAllUsers = async (req:Request, res:Response, next:NextFunction) =>{
    //get all users from database
    try {
        const users = await User.find();
        return res.status(200).json({message:"OK", users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error", cause: error.message});
    }
}

export const userSignup = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        //user signup
        const {name,email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(401).send("User already registered!");
        const hashedPassword = await hash(password,10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        // --- UPDATED COOKIE LOGIC ---
        const cookieOptions = getCookieOptions();
        
        // Clear any existing cookie before setting the new one
        res.clearCookie(COOKIE_NAME, cookieOptions);

        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        
        res.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            expires,
        });
        
        return res.status(201).json({message:"OK", name:user.name, email:user.email});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error", cause: error.message});
    }
}

export const userLogin = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        //user login
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not registered!");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password!");
        }

        // --- UPDATED COOKIE LOGIC ---
        const cookieOptions = getCookieOptions();

        // Clear any existing cookie before setting the new one
        res.clearCookie(COOKIE_NAME, cookieOptions);

        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            expires,
        });
        
        return res.status(200).json({message:"OK", name:user.name, email:user.email});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error", cause: error.message});
    }
}

export const verifyUser = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered!");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Token ID does not match user ID!");
        }
        
        return res.status(200).json({message:"OK", name:user.name, email:user.email});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error", cause: error.message});
    }
}

export const userLogout = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        // --- UPDATED COOKIE LOGIC ---
        res.clearCookie(COOKIE_NAME, getCookieOptions());
        return res.status(200).json({message:"OK"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error", cause: error.message});
    }
}
