import express from "express";
import multer from "multer";
import { uploadFile, getFiles, getFileById } from "../controllers/filesController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.get("/:id", getFileById);

export default router;
