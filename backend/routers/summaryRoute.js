import express from "express";
import { deleteSummary, getAllSummaries } from "../controller/summaryContoller.js";
import { generateSummary } from "../controller/aiController.js";

const router = express.Router();

router.post("/generate", generateSummary);
router.get("/:id", getAllSummaries);
router.delete("/:id", deleteSummary);

export default router;
