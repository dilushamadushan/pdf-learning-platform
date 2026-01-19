import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, Trophy } from 'lucide-react';
import api from '../services/api';

const Quiz = ({ documentId }) => {
  const [generating, setGenerating] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const activeQuiz = quizzes[selectedQuiz]; 

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!documentId) return;
      try {
        const res = await api.get(`/quizzes/${documentId}`);
        setQuizzes(res.data.data || []);
        setSelectedQuiz(0);
        setAnswers({});
        setShowResults(false);
      } catch (err) {
        console.error('Failed to load quizzes', err);
      }
    };
    fetchQuizzes();
  }, [documentId]);


  const handleGenerate = async () => {
    if (!documentId) return;
    setGenerating(true);
    try {
      await api.post('/quizzes/generate', { documentId }); 
      const res = await api.get(`/quizzes/${documentId}`); 
      setQuizzes(res.data.data || []);
      setSelectedQuiz(res.data.data.length - 1);
      setAnswers({});
      setShowResults(false);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      alert('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!activeQuiz) return;
    if (Object.keys(answers).length < activeQuiz.questions.length) {
      alert('Please answer all questions');
      return;
    }

    let correct = 0;
    activeQuiz.questions.forEach(q => {
      if (answers[q._id] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / activeQuiz.questions.length) * 100);

    // Update quiz score locally (you can also call an API here)
    setQuizzes(prev => {
      const updated = [...prev];
      updated[selectedQuiz] = { ...updated[selectedQuiz], completed: true, score };
      return updated;
    });

    setShowResults(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="h-full flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">Quiz</h2>
        <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Generate New Quiz'}
        </button>
      </div>

      {quizzes.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {quizzes.map((quiz, index) => (
            <button
              key={quiz._id}
              onClick={() => {
                setSelectedQuiz(index);
                setShowResults(quiz.completed || false);
                setAnswers({});
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                selectedQuiz === index
                  ? 'bg-accent-primary text-dark-900 font-medium'
                  : 'bg-dark-700 hover:bg-dark-600'
              }`}
            >
              Quiz {index + 1}
              {quiz.completed && <span className="ml-2 text-xs">({quiz.score}%)</span>}
            </button>
          ))}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-accent-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Quizzes Yet</h3>
            <p className="text-white/60 mb-6">
              Upload a PDF and generate a quiz to test your knowledge
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Quiz Results */}
          {showResults && activeQuiz?.completed && (
            <div className="glass-card p-6 mb-6 bg-gradient-to-r from-accent-primary/10 to-accent-tertiary/10 border-accent-primary/30 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-primary/20 rounded-full">
                    <Trophy className="w-8 h-8 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Quiz Completed!</h3>
                    <p className="text-white/60">Your Score: {activeQuiz.score}%</p>
                  </div>
                </div>
                <button onClick={handleRetry} className="btn-secondary">
                  Retry Quiz
                </button>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {activeQuiz?.questions.map((question, qIndex) => {
              const userAnswer = answers[question._id];
              const isCorrect = userAnswer === question.correctAnswer;
              const showAnswer = showResults;

              return (
                <div
                  key={question._id}
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: `${qIndex * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-lg text-sm font-medium">
                      Q{qIndex + 1}
                    </span>
                    {showAnswer &&
                      (isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mt-1" />
                      ))}
                  </div>

                  <p className="text-lg mb-4">{question.question}</p>

                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const isSelected = userAnswer === option;
                      const isCorrectOption = option === question.correctAnswer;

                      let className = 'p-4 rounded-xl border transition-all duration-300 cursor-pointer ';

                      if (showAnswer) {
                        if (isCorrectOption) {
                          className += 'bg-green-500/10 border-green-400/50 ';
                        } else if (isSelected && !isCorrect) {
                          className += 'bg-red-500/10 border-red-400/50 ';
                        } else {
                          className += 'bg-dark-700 border-white/10 ';
                        }
                      } else {
                        if (isSelected) {
                          className += 'bg-accent-primary/20 border-accent-primary ';
                        } else {
                          className += 'bg-dark-700 border-white/10 hover:border-accent-primary/50 ';
                        }
                      }

                      return (
                        <div
                          key={oIndex}
                          onClick={() => handleAnswerSelect(question._id, option)}
                          className={className}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-accent-primary bg-accent-primary' : 'border-white/40'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-dark-900" />}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!showResults && (
            <div className="sticky bottom-0 mt-6 pt-6 bg-dark-900/80 backdrop-blur-sm">
              <button onClick={handleSubmit} className="btn-primary w-full">
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
