import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashccard to generate
 * @return {Promise<Array<{question: string, answer: string, difficulty:string}>>}
 */

export const generateFlashCard = async (text, count = 10) => {
  const prompt = `
Generate exactly ${count} educational flashcards from the following text.

Format:
Q: Question
A: Answer
D: easy | medium | hard

Separate each flashcard with "---"

Text:
${text.substring(0, 15000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedText = response?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("");

    if (!generatedText) return [];

    const blocks = generatedText.split("---").filter((b) => b.trim());
    const flashcards = [];

    for (const block of blocks) {
      let question = "",
        answer = "",
        difficulty = "medium";

      for (const line of block.split("\n")) {
        const t = line.trim();
        if (t.startsWith("Q:")) question = t.slice(2).trim();
        if (t.startsWith("A:")) answer = t.slice(2).trim();
        if (t.startsWith("D:")) {
          const d = t.slice(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(d)) difficulty = d;
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Gemini error:", error);
    return [];
  }
};

/**
 * Generate quie questions
 * @param {number} text - Document text
 * @param {number} numberQuestions - Number of flashccard to generate
 * @return {Promise<Array<{question: string, options: Array, correctAnswer:string, explanation: string,difficulty: string}>>}
 */

export const generateQuize = async (text, numberQuestions = 5) => {
  const prompt = `Generate exactly ${numberQuestions} multiple choice questions from the following text.
    Format each qestion as: 
    Q: [Question]
    Q1: [Option 1]
    Q2: [Option 2]
    Q3: [Option 3]
    Q4: [Option 4]
    C: [Correct option number ONLY: Q1, Q2, Q3, or Q4]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, or hard]
    
    Separate questions with "---"
    
    Text
    ${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    // ✅ EXTRACT TEXT CORRECTLY
    const generatedText = response?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("");

    if (!generatedText) return [];

    const blocks = generatedText.split("---").filter((b) => b.trim());
    const questions = [];

    for (const block of blocks) {
      const lines = block.split("\n");
      let q = "",
        options = [],
        correctAnswer = "",
        explanation = "",
        difficulty = "medium";

      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith("Q:")) q = t.slice(2).trim();
        else if (t.match(/^Q[1-4]:/)) options.push(t.slice(3).trim());
        else if (t.startsWith("C:")) correctAnswer = t.slice(2).trim();
        else if (t.startsWith("E:")) explanation = t.slice(2).trim();
        else if (t.startsWith("D:")) {
          const d = t.slice(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(d)) difficulty = d;
        }
      }

      if (q && options.length === 4 && correctAnswer) {
        questions.push({
          question: q,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }

    return questions.slice(0, numberQuestions);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

/**
 * Generate summary
 * @param {string} text - Document text
 * @return {Promise<string>}
 */

export const generateSummary = async (text) => {
  const prompt = `Provide a  concise summary of the following text, highlighting the key concept, main ideas, and import points
    Keep the summery clear and structured.
    
    Text:
    ${text.substring(0, 2000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Chat with document context
 * @param {string} question - user question
 * @param {Array<Object>} chunks - Relevant documet chunks
 * @return {Promise<string>}
 */

export const chatWithContext = async (question, chunks) => {
  try {
    const context = chunks
      .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
      .join("\n\n");

    const prompt = `Answer strictly from the document context.
                If not found, say so.

                Context:
                ${context}

                Question: ${question}

                Answer:
                `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    if (error.status === 429) {
      return "⚠️ AI rate limit reached. Please try again in a minute.";
    }
    throw error;
  }
};
