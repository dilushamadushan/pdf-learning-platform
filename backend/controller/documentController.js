import { extractTextFromPDF } from "../utils/pdfParser.js"; 
import { chunkText } from "../utils/textChunker.js"; 
import Document from "../model/Document.js";

export const createNewDoc = async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload PDF document
 */
export const uploadDoc = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const fileURL = `${req.protocol}://${req.get("host")}/upload/documents/${req.file.filename}`;

    let document;

    // 2. If ID exists → UPDATE
    if (id) {
      document = await Document.findById(id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      document.fileName = req.file.originalname;
      document.filePath = fileURL;

      await document.save();
    }

    // 4. Process PDF asynchronously
    processPdf(document._id, req.file.path);

    res.status(201).json({
      message: id ? "Document updated successfully" : "Document uploaded successfully",
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


export const getAllDocs = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getDocById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }   
    res.status(200).json(document);
    } catch (error) { 
    res.status(500).json({ error: error.message });
  }
};