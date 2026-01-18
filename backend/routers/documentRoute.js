import express from "express";
import {uploadDoc, createNewDoc} from '../controller/documentController.js'
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", createNewDoc);
router.post("/:id", upload.single("file"), uploadDoc);;

export default router;
