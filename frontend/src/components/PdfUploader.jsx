import { useState, useEffect } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";
import api from "../services/api";

const PdfUploader = ({ documentId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [document, setDocument] = useState(null);

  const pdfFile = document?.filePath;
  const pdfName = document?.fileName;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${documentId}`);
        setDocument(res.data);
      } catch (err) {
        console.error("Failed to load document", err);
      }
    };

    fetchDocument();
  }, [documentId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    setUploading(true);
    setUploadProgress(0);

    try {
      await api.post(`/documents/${documentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      setUploadProgress(100);
      const res = await api.get(`/documents/${documentId}`);
      setDocument(res.data);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload PDF");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-accent-primary" />
        PDF Document
      </h3>

      {!pdfFile ? (
        <div>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent-primary/50 hover:bg-dark-700/30 transition-all duration-300 group">
              <Upload className="w-12 h-12 mx-auto mb-4 text-white/40 group-hover:text-accent-primary transition-colors duration-300" />
              <p className="text-white/60 mb-2">
                Drop your PDF here or{" "}
                <span className="text-accent-primary">browse</span>
              </p>
              <p className="text-sm text-white/40">PDF files only</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {uploading && (
            <div className="mt-4 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Uploading...</span>
                <span className="text-sm text-accent-primary">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-tertiary transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 p-4 bg-dark-700/50 rounded-xl border border-accent-primary/30">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <File className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{pdfName}</p>
              <p className="text-xs text-white/40">PDF Document</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>

          <div className="mt-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
            <p className="text-xs text-accent-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              PDF uploaded successfully. You can now generate content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
