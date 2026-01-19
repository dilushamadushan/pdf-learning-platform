import { FileText, Calendar, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../context/DocumentContext";

const DocumentCard = ({ document }) => {
  const navigate = useNavigate();
  const { deleteDocument } = useDocuments();

  const handleClick = () => {
    navigate(`/document/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteDocument(document._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="glass-card p-6 cursor-pointer group hover:border-accent-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-primary/10 animate-fade-in"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 rounded-xl group-hover:from-accent-primary/30 group-hover:to-accent-tertiary/30 transition-all duration-300">
          <FileText className="w-6 h-6 text-accent-primary" />
        </div>
        <button
          onClick={handleDelete}
          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all duration-300"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-accent-primary transition-colors duration-300">
        {document.title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-white/60">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(document.createdAt)}</span>
      </div>

      {document.fileName && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40 truncate">{document.fileName}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
