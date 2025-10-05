import express from "express";
import multer from "multer";
import { uploadFile, getFiles, getFileById, } from "../../controllers/filesController.js";

const filesRoutes = express.Router();
const upload = multer({ dest: "uploads/" });

filesRoutes.post("/upload", upload.single("file"), uploadFile);
filesRoutes.get("/", getFiles);
filesRoutes.get("/:id", getFileById);

export default filesRoutes;
