import Document from "../model/Document.js";
import Flashcard from "../model/Flashcard.js";
import Quize from "../model/Quize.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";
import normalizeCorrectAnswer from '../utils/helper.js'
import Summary from "../model/Summary.js";

export const generaetFlashCards = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "Please provide document" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // 1️⃣ Generate flashcards from AI
    const generatedCards = await geminiService.generateFlashCard(
      document.extractedText,
      Number(5)
    );

    if (!Array.isArray(generatedCards) || !generatedCards.length) {
      return res.status(400).json({
        message: "Failed to generate flashcards",
      });
    }

    // 2️⃣ Prepare flashcards for DB
    const flashcardsToSave = generatedCards.map((card) => ({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || "medium",
      documentId,
    }));

    // 3️⃣ Save to database (bulk insert)
    const savedFlashcards = await Flashcard.insertMany(flashcardsToSave);

    res.status(201).json({
      success: true,
      message: "Flashcards generated and saved successfully.",
      data: savedFlashcards,
    });

  } catch (error) {
    console.error("Flashcard generation error:", error);
    res.status(500).json({ message: "Failed to generate flashcards" });
  }
};


export const generaetQuizs = async (req, res) => {
  try {
    const { documentId, numQuestion = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "Please provide document" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const generatedQuestions = await geminiService.generateQuize(
      document.extractedText,
      Number(numQuestion)
    );

    if (!Array.isArray(generatedQuestions) || !generatedQuestions.length) {
      return res.status(400).json({
        message: "Failed to generate quiz questions",
      });
    }

    const quiz = await Quize.create({
      documentId,
      title: title || "Generated Quiz",
      questions: generatedQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: normalizeCorrectAnswer(q.correctAnswer, q.options),
        explanation: q.explanation || "",
        difficulty: q.difficulty || "medium",
      })),
    });

    res.status(201).json({
      success: true,
      message: "Quiz generated and stored successfully.",
      data: quiz,
    });

  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};


export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "Please provide document" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // Generate summary using AI
    const summaryText = await geminiService.generateSummary(
      document.extractedText
    );

    if (!summaryText) {
      return res.status(400).json({
        message: "Failed to generate summary",
      });
    }

    const summary = await Summary.create({
      documentId,
      content: summaryText,
    });

    res.status(201).json({
      success: true,
      message: "Summary generated and stored successfully.",
      data: summary,
    });
  } catch (error) {
    console.error("Summary generation error:", error);
    next(error);
  }
};

export const generaetChat = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId)
      return res.status(400).json({ message: "Please provide document" });

    const document = await Document.findById(documentId);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // ✅ CALL FUNCTION PROPERLY
    const relevantChunks = findRelevantChunks(document.chunks, question);

    if (!relevantChunks.length) {
      return res.status(200).json({
        success: true,
        data: { question, answer: "No relevant context found." },
      });
    }

    const chunkIndices = relevantChunks.map((c) => c.chunkIndex ?? -1);

    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks,
    );

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        chunkIndices,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
