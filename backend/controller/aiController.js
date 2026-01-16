import Document from '../model/Document.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

export const generaetFlashCards = async (req, res) => {
    try {
        const { documentId, count = 10 } = req.body;
        if(!documentId) return res.status(400).json({messages: "Please provide document"});
        const document = await Document.findOne({_id : documentId });
        if(!document) return res.status(400).json({messages: "Document not found."});
        const card = await geminiService.generateFlashCard(
            document.extractedText,
            Number(count)
        );
        res.status(201).json({
            sucess: true,
            data: card,
            message: "Flashcard generated successfully."
        });
    } catch (error) {
        console.log(error);
        
    }
}