import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Footer } from '../components/Footer';

interface RankingEntry {
  username: string;
  avatar_url: string | null;
  score: number;
  rank: number;
}

export const Rankings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
    // Update rankings every 0.9 seconds
    const interval = setInterval(loadRankings, 900);
    return () => clearInterval(interval);
  }, []);

  const loadRankings = async () => {
    try {
      // Get quiz ID for Bitcoin quiz
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('id')
        .eq('topic', 'Bitcoin Fundamentals')
        .single();

      if (quizData) {
        // Get all attempts for this quiz
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select(`
            user_id,
            score,
            profiles!inner (
              username,
              avatar_url
            )
          `)
          .eq('quiz_id', quizData.id)
          .order('score', { ascending: false });

        if (attempts) {
          // Group by user and take highest score
          const userBestScores = new Map();
          attempts.forEach(attempt => {
            const userId = attempt.user_id;
            if (!userBestScores.has(userId) || attempt.score > userBestScores.get(userId).score) {
              userBestScores.set(userId, attempt);
            }
          });

          // Convert to array and add ranks
          const processedRankings = Array.from(userBestScores.values())
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({
              username: entry.profiles.username,
              avatar_url: entry.profiles.avatar_url,
              score: entry.score,
              rank: index + 1,
            }));

          setRankings(processedRankings);
        }
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex-grow p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Global Rankings</h2>

            {rankings.length > 0 ? (
              <div className="space-y-4">
                {rankings.map((entry) => (
                  <motion.div
                    key={`${entry.username}-${entry.rank}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center p-4 rounded-lg ${
                      entry.username === user?.username
                        ? 'bg-purple-50 border-2 border-purple-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
                      <img
                        src={entry.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`}
                        alt={entry.username}
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="font-medium">{entry.username}</div>
                      <div className="text-sm text-gray-500">Score: {entry.score}%</div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-400">#{entry.rank}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No rankings available yet. Be the first to complete a quiz!</p>
              </div>
            )}

            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};