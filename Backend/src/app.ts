import express from 'express';
import morgan from "morgan";
import { config } from "dotenv";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();

// --- DEBUGGING ---
console.log("--- DEBUGGING ENV VARIABLES ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("COOKIE_SECRET Loaded:", !!process.env.COOKIE_SECRET);
console.log("JWT_SECRET Loaded:", !!process.env.JWT_SECRET);
console.log("CORS_ORIGIN Loaded:", process.env.CORS_ORIGIN);
console.log("---------------------------------");
// --- END DEBUGGING ---

const app = express();
app.use(express.json());

// --- CLEANED UP CORS CONFIG ---
const allowedOrigins = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
// --- END CORS ---

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
app.use("/api/v1", appRouter);

export default app;
