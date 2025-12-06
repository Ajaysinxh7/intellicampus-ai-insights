import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import attendanceRoutes from "./routes/attendance";
import marksRoutes from "./routes/marks";
import chatbotRoutes from "./routes/chatbot";
import usersRoutes from "./routes/users";
import riskRoutes from "./routes/risk";
import adminRoutes from "./routes/admin";

import { verifyAccessToken } from "./middleware/auth";
import connectDB from "./utils/db";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:8080",
    "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Routes
app.use("/api", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/admin", adminRoutes);


app.get("/api/protected", verifyAccessToken, (req, res) => {
    res.json({ message: "Protected route accessed" });
});

// Start server
app.listen(8083, () => console.log("Server running on port 8083"));
