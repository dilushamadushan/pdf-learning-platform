import express from "express";
import { generaetFlashCards } from "../controller/aiController.js";

const router = express.Router();

router.get("/", generaetFlashCards);

export default router;