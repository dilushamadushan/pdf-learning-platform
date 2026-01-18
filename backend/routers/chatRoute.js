import express from "express";
import { generaetChat } from "../controller/aiController.js";

const router = express.Router();

router.post("/", generaetChat);

export default router;
