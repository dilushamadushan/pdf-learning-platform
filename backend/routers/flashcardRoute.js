import express from 'express';
import {getAllFlashcards,deleteFlashcard} from '../controller/flashcardController.js';
import { generaetFlashCards } from '../controller/aiController.js';

const router = express.Router();

router.post("/generate", generaetFlashCards);
router.get('/:id', getAllFlashcards);
router.delete('/:id', deleteFlashcard);

export default router;