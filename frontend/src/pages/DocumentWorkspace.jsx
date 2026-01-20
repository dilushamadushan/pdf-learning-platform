import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import PdfUploader from "../components/PdfUploader";
import Tabs from "../components/Tabs";
import Flashcards from "../components/Flashcards";
import Quiz from "../components/Quiz";
import Summary from "../components/Summary";
import Chat from "../components/Chat";
import { useDocuments } from "../context/DocumentContext";

const DocumentWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flashcards");
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const { deleteDocument } = useDocuments();

  const handleTitleSave = () => {};

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this document? This action cannot be undone.",
      )
    ) {
      deleteDocument(id);
      navigate("/");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "flashcards":
        return <Flashcards documentId={id} />;
      case "quiz":
        return <Quiz documentId={id} />;
      case "summary":
        return <Summary documentId={id} />;
      case "chat":
        return <Chat documentId={id} />;
      default:
        return <Flashcards documentId={id} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card m-4 mb-0 p-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-dark-700 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
              <div className="flex items-center gap-2 group cursor-pointer flex-1 min-w-0">
                <h1
                  onClick={() => setEditingTitle(true)}
                  className="text-2xl font-bold font-display truncate"
                >
                  PDF Learning platform
                </h1>
              </div>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300 ml-4"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-80 flex-shrink-0">
          <PdfUploader documentId={id} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 gap-4">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1 glass-card p-6 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentWorkspace;
