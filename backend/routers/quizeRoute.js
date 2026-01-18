import express from 'express';
import { getAllQuizzes } from '../controller/quizeController.js';
import { generaetQuizs } from '../controller/aiController.js';

const router = express.Router();

router.post("/generate", generaetQuizs);
router.get('/', getAllQuizzes);

export default router;