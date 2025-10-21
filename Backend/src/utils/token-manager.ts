
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => { // Added 'string' type for expiresIn
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
}

// --- THIS IS THE CORRECTED FUNCTION ---
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];

    // If cookie is missing
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not found" });
    }

    // Verify the token
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
            // If token is invalid or expired
            return res.status(401).json({ message: "Token expired or invalid" });
        } else {
            // Token is valid, set user data and proceed
            res.locals.jwtData = success;
            return next();
        }
    });
}
