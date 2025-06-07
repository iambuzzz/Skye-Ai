import User from "../models/user.js";
import {NextFunction, Request, Response} from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (req:Request, res:Response, next:NextFunction) =>{
    //get all users from database
    try {
        const users = await User.find();
        return res.status(200).json({message:"OK", users});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
        
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
        //create token and store cookie
        res.clearCookie(COOKIE_NAME,{path:"/" , domain:"localhost" , httpOnly:true, signed:true,});
        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME,token, {path:"/" , domain:"localhost" , expires, httpOnly:true, signed:true,});
        return res.status(200).json({message:"OK", name:user.name, email:user.email, id:user._id.toString()});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
        
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
        res.clearCookie(COOKIE_NAME,{path:"/" , domain:"localhost" , httpOnly:true, signed:true,});
        const token = createToken(user._id.toString(),user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME,token, {path:"/" , domain:"localhost" , expires, httpOnly:true, signed:true,});
        return res.status(200).json({message:"OK", name:user.name, email:user.email, id:user._id.toString()});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
        
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
        
        return res.status(200).json({message:"OK", name:user.name, email:user.email, id:user._id.toString()});

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
        
    }
}

export const userLogout = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        res.clearCookie(COOKIE_NAME,{path:"/" , domain:"localhost" , httpOnly:true, signed:true,});
        return res.status(200).json({message:"OK"});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error", cause: error.message});
        
    }
}