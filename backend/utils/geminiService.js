import dotenv from 'dotenv'
import {GoogleGenAI } from "@google/genai"

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashccard to generate
 * @return {Promise<Array<{question: string, answer: string, difficulty:string}>>}
 */

