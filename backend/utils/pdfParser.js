import fs from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ works with v1.1.1

export const extractTextFromPDF = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);

    const data = await pdfParse(buffer); // ✅ function

    return {
      text: data.text,
      numPages: data.numpages || data.numPages,
      info: data.info
    };
  } catch (error) {
    console.error("❌ PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
