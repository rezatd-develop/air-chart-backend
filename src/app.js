import express from "express";
import userRoutes from "./routes/userRoutes.js";
import filesRoutes from './routes/filesRoutes.js';
import { connectDB } from "./config/db.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/files", filesRoutes)

export default app;
