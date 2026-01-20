import { extractTextFromPDF } from "../utils/pdfParser.js"; 
import { chunkText } from "../utils/textChunker.js"; 
import Document from "../model/Document.js";
import Flashcard from "../model/Flashcard.js";
import Summary from "../model/Summary.js";
import Qiza from "../model/Quize.js";

export const createNewDoc = async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadDoc = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const fileURL = `${req.protocol}://${req.get("host")}/upload/documents/${req.file.filename}`;

    let document;

    if (id) {
      document = await Document.findById(id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      document.fileName = req.file.originalname;
      document.filePath = fileURL;

      await document.save();
    }

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

export const deleteDoc = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if document exists
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Delete document
    await Document.findByIdAndDelete(id);

    // Delete related data
    await Flashcard.deleteMany({ documentId: id });
    await Summary.deleteMany({ documentId: id });
    await Qiza.deleteMany({ documentId: id });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
