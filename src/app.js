import express from "express";
import userRoutes from "./routes/userRoutes.js";
import filesRoutes from './routes/filesRoutes/filesRoutes.js';
import dashboardRoutes from './routes/dashboard/dashboardRoutes.js';
import { connectDB } from "./config/db.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
