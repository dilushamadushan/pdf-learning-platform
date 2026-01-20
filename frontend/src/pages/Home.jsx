import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";
import { useDocuments } from "../context/DocumentContext";

const Home = () => {
  const navigate = useNavigate();
  const { documents, createDocument, loading } = useDocuments();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");

  const handleCreateDocument = async () => {
    const title = newDocTitle.trim() || "Untitled Document";

    const newDoc = await createDocument(title); 

    setNewDocTitle("");
    setShowCreateModal(false);
    navigate(`/document/${newDoc._id}`); 
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-accent-primary to-accent-tertiary rounded-xl">
              <BookOpen className="w-8 h-8 text-dark-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-gradient">
                PDF Learning Platform
              </h1>
              <p className="text-white/60 mt-1">
                Transform your PDFs into interactive learning experiences
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            onClick={() => setShowCreateModal(true)}
            className="glass-card p-6 cursor-pointer group border-dashed border-2 hover:border-accent-primary transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[200px] animate-fade-in"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-accent-primary/20 flex items-center justify-center group-hover:bg-accent-primary/30 transition-all duration-300">
              <Plus className="w-8 h-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-primary transition-colors duration-300">
              Create New Document{" "}
            </h3>
            <p className="text-sm text-white/60 text-center">
              Start a new learning session
            </p>
          </div>
          {documents.map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>

        {documents.length === 0 && (
          <p className="text-center text-white/40 mt-10">No documents yet.</p>
        )}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          
          <div className="glass-card p-8 max-w-md w-full animate-slide-up">
            
            <h2 className="text-2xl font-bold mb-6">
              Create New Document
            </h2>
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Document title (optional)"
              className="input-field mb-6"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleCreateDocument()}
            />
            <div className="flex gap-3">
              
              <button
                onClick={handleCreateDocument}
                className="btn-primary flex-1"
              >
                
                Create
              </button>
              <button
                onClick={() => {
                setShowCreateModal(false);
                setNewDocTitle("");
              }}
                className="btn-secondary flex-1"
              >
                
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
