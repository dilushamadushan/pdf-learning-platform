import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAllLearningSessions,
  createNewLearningSession
} from '../services/api';

const DocumentContext = createContext(null);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all docs
  useEffect(() => {
    const fetchDocs = async () => {
      const data = await getAllLearningSessions();
      setDocuments(data);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  // ✅ Create document
  const createDocument = async (title) => {
    const newDoc = await createNewLearningSession({ title });
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  // ✅ Delete document
  const deleteDocument = async (id) => {
    await deleteLearningSession(id);
    setDocuments(prev => prev.filter(doc => doc._id !== id));
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        createDocument,
        deleteDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
