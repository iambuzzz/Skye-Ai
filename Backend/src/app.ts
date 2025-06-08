import express from 'express';
import morgan from "morgan";
import { config } from "dotenv";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config(); // Make sure this is called early to load .env variables

const app = express();
app.use(express.json());

// --- MODIFIED CORS CONFIGURATION ---
const allowedOrigins = process.env.CORS_ORIGIN // Check if CORS_ORIGIN is set in environment
    ? process.env.CORS_ORIGIN.split(',') // Split by comma if multiple origins are needed
    : "http://localhost:5173"; // Fallback to local dev origin if env var is not set

app.use(cors({
    origin: allowedOrigins, // Use the dynamically determined origin(s)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
// --- END MODIFIED CORS ---

app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove it in production (consider using 'tiny' or 'combined' for production)
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;
