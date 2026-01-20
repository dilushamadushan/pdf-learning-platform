import express from "express";
import {uploadDoc, createNewDoc, getAllDocs, getDocById, deleteDoc} from '../controller/documentController.js'
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", createNewDoc);
router.post("/:id", upload.single("file"), uploadDoc);
router.get("/", getAllDocs);
router.get("/:id", getDocById);
router.delete("/:id", deleteDoc);

export default router;
