import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv';
dotenv.config();
import { dbConnect } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

dbConnect();
app.listen(PORT ,() =>{
    console.log(`Server is running on 🌀 http://localhost:${PORT}`);
})