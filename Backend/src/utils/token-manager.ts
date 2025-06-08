import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id:string, email:string, expiresIn)=>{
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});
    return token;
}

// --- REFACTORED AND IMPROVED verifyToken MIDDLEWARE ---
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // The cookie-parser middleware with a secret will unsign the cookie.
    // We access it via `req.signedCookies`.
    const token = req.signedCookies[`${COOKIE_NAME}`];

    // If there's no token, it means the cookie was not sent by the browser,
    // or the COOKIE_SECRET is wrong and it couldn't be unsigned.
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received or cookie secret mismatch." });
    }

    // Now, verify the JWT token itself.
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
            // This error means the JWT_SECRET is wrong or the token is expired/invalid.
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ message: "Token Expired or Invalid" });
        }
        
        // If verification is successful, attach the user data to the request and continue.
        res.locals.jwtData = success;
        return next();
    });
}
