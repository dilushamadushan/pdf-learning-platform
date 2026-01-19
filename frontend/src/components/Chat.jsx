import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import api from '../services/api';

const Chat = ({ documentId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !documentId) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        documentId,
        question: userMessage.content,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.data.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: 'Sorry, something went wrong.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-slide-in-right">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display mb-2">Chat with PDF</h2>
        <p className="text-white/60 text-sm">
          Ask questions about your document
        </p>
      </div>

      {!documentId ? (
        <div className="flex-1 flex items-center justify-center text-white/60">
          Upload a PDF to start chatting
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 mt-20">
                Ask your first question about the PDF
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
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
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-dark-900" />
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl">
                  <span className="text-white/60">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
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
              className="btn-primary px-4"
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
