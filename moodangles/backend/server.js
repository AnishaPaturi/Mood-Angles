import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRRoute from "./routes/agentR.js"; 
import agentRTestRoute from "./routes/agentRTestRoute.js";
import agentDRoute from "./routes/agentD.js"; 
import agentCRoute from "./routes/agentC.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", agentRRoute);
app.use("/api", agentRTestRoute);
app.use("/api", agentDRoute);
app.use("/api", agentCRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
