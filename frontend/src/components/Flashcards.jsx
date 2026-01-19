import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import api from '../services/api';

const FlashcardCard = ({ card, index }) => {
  const [flipped, setFlipped] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'hard':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-white/60 bg-white/5 border-white/20';
    }
  };

  return (
    <div
      className="relative h-64 cursor-pointer perspective-1000 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-accent-primary/50 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/40">Question</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(card.difficulty)}`}>
                  {card.difficulty || 'Medium'}
                </span>
              </div>
              <p className="text-lg leading-relaxed">{card.question}</p>
            </div>
            <div className="text-center text-sm text-white/40 mt-4">Click to reveal answer</div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="glass-card p-6 h-full flex flex-col justify-between bg-gradient-to-br from-accent-primary/5 to-accent-tertiary/5 border-accent-primary/30 hover:border-accent-primary/50 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-accent-primary">Answer</span>
                <RotateCcw className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-lg leading-relaxed">{card.answer}</p>
            </div>
            <div className="text-center text-sm text-white/40 mt-4">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Flashcards = ({ documentId }) => {
  const [generating, setGenerating] = useState(false);
  const [cards, setCards] = useState([]); 

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!documentId) return;
      try {
        const res = await api.get(`/flashcards/${documentId}`);
        setCards(res.data.data || []);
      } catch (err) {
        console.error('Failed to load flashcards', err);
        setCards([]);
      }
    };

    fetchFlashcards();
  }, [documentId]);

  const handleGenerate = async () => {
    if (!documentId) return;

    setGenerating(true);
    try {
      await api.post('/flashcards/generate', { documentId });
      // Fetch after generation
      const res = await api.get(`/flashcards/${documentId}`);
      setCards(res.data.data || []);
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      alert('Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">Flashcards</h2>
        <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-accent-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Flashcards Yet</h3>
            <p className="text-white/60 mb-6">Upload a PDF and generate flashcards to start learning</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <FlashcardCard key={index} card={card} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
