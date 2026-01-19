import { useState } from 'react';
import { Sparkles, Copy, CheckCircle } from 'lucide-react';
import {  } from '../services/api';
import { useDocuments } from '../context/DocumentContext';

const Summary = ({ documentId }) => {
  const { documents, addSummary } = useDocuments();
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDoc = documents.find(d => d.id === documentId);
  const summaries = currentDoc?.summaries || [];
  const summary = summaries[0]; // Only keep the latest summary
  const pdfFile = currentDoc?.pdfFile;

  const handleGenerate = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF first');
      return;
    }

    setGenerating(true);
    try {
      const response = await apiService.generateSummary(documentId, pdfFile);
      addSummary(documentId, response.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">Summary</h2>
        <button
          onClick={handleGenerate}
          disabled={!pdfFile || generating}
          className={`btn-primary flex items-center gap-2 ${
            (!pdfFile || generating) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : summary ? 'Regenerate Summary' : 'Generate Summary'}
        </button>
      </div>

      {!summary ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-accent-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Summary Yet</h3>
            <p className="text-white/60 mb-6">
              Upload a PDF and generate a summary to get a quick overview
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="glass-card p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold mb-1">Document Summary</h3>
                <p className="text-sm text-white/40">
                  Generated on {new Date(summary.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 leading-relaxed whitespace-pre-line">
                {summary.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
