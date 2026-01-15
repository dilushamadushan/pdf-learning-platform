import { extractTextFromPDF } from "../utils/pdfParser.js"; 
import { chunkText } from "../utils/textChunker.js"; 
import Document from "../model/Document.js";

/**
 * Upload PDF document
 */
export const uploadDoc = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a PDF file" });
        }

        const fileURL = `${req.protocol}://${req.get("host")}/upload/documents/${req.file.filename}`;

        const document = await Document.create({
            title: req.body.title || req.file.originalname,
            fileName: req.file.originalname,
            filePath: fileURL
        });

        // Process PDF asynchronously (non-blocking)
        processPdf(document._id, req.file.path);

        res.status(201).json({
            message: "Document uploaded successfully",
            documentId: document._id
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Document upload failed" });
    }
};

/**
 * Extract text & chunk PDF
 */
const processPdf = async (documentId, filePath) => {
    try {
        const { text } = await extractTextFromPDF(filePath);
        const chunks = chunkText(text, 500, 50);

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks
        });

        console.log("PDF processed successfully");
    } catch (error) {
        console.error("PDF processing error:", error);
    }
};

/**
 * Get all documents OR single document by ID
 */
export const getDoc = async (req, res) => {
    try {
        const { id } = req.params;

        // Get single document
        if (id) {
            const document = await Document.findById(id);
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }
            return res.status(200).json(document);
        }

        // Get all documents
        const documents = await Document.find().sort({ createdAt: -1 });
        res.status(200).json(documents);

    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};
