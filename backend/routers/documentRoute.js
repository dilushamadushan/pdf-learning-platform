import express from "express";
import {uploadDoc, createNewDoc, getAllDocs, getDocById} from '../controller/documentController.js'
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", createNewDoc);
router.post("/:id", upload.single("file"), uploadDoc);
router.get("/", getAllDocs);
router.get("/:id", getDocById);

export default router;
