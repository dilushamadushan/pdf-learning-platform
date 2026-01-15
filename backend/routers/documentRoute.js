import express from "express";
import {uploadDoc,getDoc} from '../controller/documentController.js'
import upload from "../config/multer.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDoc);
router.get("/", getDoc);
router.get("/:id", getDoc);

export default router;
