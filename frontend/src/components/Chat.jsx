import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import {  } from '../services/api';
import { useDocuments } from '../context/DocumentContext';

const Chat = ({ documentId }) => {
  const { documents, addChatMessage } = useDocuments();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentDoc = documents.find(d => d.id === documentId);
  const chatHistory = currentDoc?.chatHistory || [];
  const pdfFile = currentDoc?.pdfFile;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !pdfFile) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(documentId, userMessage);
    setMessage('');
    setLoading(true);

    try {
      const response = await apiService.chatWithPdf(
        documentId,
        userMessage.content,
        pdfFile,
        chatHistory
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      addChatMessage(documentId, aiMessage);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(documentId, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-slide-in-right">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display mb-2">Chat with PDF</h2>
        <p className="text-white/60 text-sm">
          Ask questions about your document and get instant answers
        </p>
      </div>

      {!pdfFile ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 flex items-center justify-center">
              <Bot className="w-10 h-10 text-accent-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload a PDF to Start</h3>
            <p className="text-white/60 mb-6">
              Upload a PDF document to begin chatting and asking questions
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-4">
            {chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md animate-fade-in">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-accent-primary" />
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-white/60 text-sm">
                    Ask me anything about your PDF document
                  </p>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 animate-slide-up ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-dark-900" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-accent-primary text-dark-900 rounded-br-none'
                          : 'glass-card rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-dark-900/60' : 'text-white/40'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 animate-slide-up">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-dark-900" />
                    </div>
                    <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about your PDF..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`btn-primary px-4 ${
                (!message.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
