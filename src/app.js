import express from "express";
import cors from "cors";
import filesRoutes from './routes/filesRoutes/filesRoutes.js';
import dashboardRoutes from './routes/dashboard/dashboardRoutes.js';
import authRoutes from "./routes/authRoutes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { verifyToken } from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://167.88.165.4:3000", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
connectDB();

app.use(verifyToken);

app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
