import express from 'express';
import morgan from "morgan";
import { config } from "dotenv";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
app.use(express.json());

//middleware
app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://ai-chatbot-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
//remove it in production
app.use(morgan("dev"));
app.use("/api/v1", appRouter);


export default app;