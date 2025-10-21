import User from "../models/user.js";
import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

/**
 * Dynamically creates cookie options based on the environment.
 * In production (e.g., Render), it uses secure, cross-domain settings.
 * In development, it uses settings for localhost.
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    path: "/",
    // Set domain to .onrender.com for production to allow cross-subdomain cookies
    domain: isProduction ? ".onrender.com" : "localhost",
    httpOnly: true,
    signed: true,
    // Use secure cookies in production (requires HTTPS)
    secure: isProduction,
    // sameSite 'none' is required for cross-site cookies, and 'secure' must be true
    sameSite: isProduction ? "none" : "lax",
  };
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message }); // Use 500 for server errors
  }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered!");

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Get cookie options
    const cookieOptions = getCookieOptions();

    // Clear any existing cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    // Create token and set new cookie
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    
    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      expires,
    });

    return res.status(201).json({ // Use 201 for resource creation
      message: "OK",
      name: user.name,
      email: user.email,
      id: user._id.toString(),
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered!");
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password!");
    }

    // Get cookie options
    const cookieOptions = getCookieOptions();

    // Clear any existing cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    // Create token and set new cookie
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      expires,
    });

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
      id: user._id.toString(),
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // res.locals.jwtData is set by your auth middleware
    const user = await User.findById(res.locals.jwtData.id); 
    if (!user) {
      return res.status(401).send("User not registered!");
    }
    
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Token ID does not match user ID!");
    }

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
      id: user._id.toString(),
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get cookie options to ensure domain and path match
    const cookieOptions = getCookieOptions();
    
    res.clearCookie(COOKIE_NAME, cookieOptions);
    
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};
