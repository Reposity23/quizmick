import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Quiz, QuizAttempt } from '../types';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getQuizTopics } from '../lib/quizLoader';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
    loadHistory();
    const interval = setInterval(loadQuizzes, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadQuizzes = async () => {
    try {
      const topics = getQuizTopics();
      const { data: dbQuizzes } = await supabase
        .from('quizzes')
        .select('*');

      const mergedQuizzes = topics.map(topic => {
        const dbQuiz = dbQuizzes?.find(q => q.topic === topic.topic) || { total_takers: 0 };
        return {
          ...topic,
          total_takers: dbQuiz.total_takers
        };
      });

      setQuizzes(mergedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes(*)
        `)
        .eq('user_id', userData.user.id)
        .order('completed_at', { ascending: false });

      const latestAttempts = new Map();
      data?.forEach(attempt => {
        if (!latestAttempts.has(attempt.quiz_id)) {
          latestAttempts.set(attempt.quiz_id, attempt);
        }
      });
      
      setHistory(Array.from(latestAttempts.values()));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="w-full max-w-md mx-auto">
              <div className="relative glass-effect rounded-lg">
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
            </motion.button>
          </div>

          {/* History Section */}
          <section className="mb-12 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 gradient-text">Your History</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {history.map((attempt) => (
                <motion.div
                  key={attempt.id}
                  className="quiz-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">{attempt.quizzes?.topic}</h3>
                  <div className="flex justify-between items-center">
                    <div className="stats-card">
                      <div className="text-sm font-medium text-gray-600">Score</div>
                      <div className="text-lg font-bold gradient-text">{attempt.score}%</div>
                    </div>
                    <div className="stats-card">
                      <div className="text-sm font-medium text-gray-600">Rank</div>
                      <div className="text-lg font-bold gradient-text">#{attempt.rank || '-'}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {history.length === 0 && (
                <div className="col-span-full text-center py-8 glass-effect rounded-xl">
                  <p className="text-gray-600">No quiz attempts yet. Start your first quiz!</p>
                </div>
              )}
            </div>
          </section>

          {/* Available Quizzes Section */}
          <section className="animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 gradient-text">Available Quizzes</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  className="quiz-card"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleQuizClick(quiz.id)}
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">{quiz.topic}</h3>
                  <div className="flex justify-between items-center">
                    <div className="stats-card">
                      <div className="text-sm font-medium text-gray-600">Questions</div>
                      <div className="text-lg font-bold gradient-text">{quiz.total_questions}</div>
                    </div>
                    <div className="stats-card">
                      <div className="text-sm font-medium text-gray-600">Takers</div>
                      <div className="text-lg font-bold gradient-text">{quiz.total_takers}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full text-center py-8 glass-effect rounded-xl">
                  <p className="text-gray-600">No quizzes found. Try a different search term.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};