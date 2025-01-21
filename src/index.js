import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
dotenv.config();
import { dbConnect } from './lib/db.js';
import cookieParser from 'cookie-parser'

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

dbConnect();
app.listen(PORT ,() =>{
    console.log(`Server is running on 🌀 http://localhost:${PORT}`);
})