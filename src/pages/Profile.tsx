import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface QuizHistory {
  topic: string;
  score: number;
  rank: number;
  completed_at: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
    loadQuizHistory();
  }, [user]);

  const loadQuizHistory = async () => {
    try {
      const { data } = await supabase
        .from('quiz_attempts')
        .select(`
          score,
          completed_at,
          rank,
          quizzes (
            topic
          )
        `)
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });

      if (data) {
        // Group by quiz topic and take the latest attempt
        const historyMap = new Map<string, QuizHistory>();
        data.forEach(attempt => {
          const topic = attempt.quizzes.topic;
          if (!historyMap.has(topic)) {
            historyMap.set(topic, {
              topic,
              score: attempt.score,
              rank: attempt.rank,
              completed_at: attempt.completed_at
            });
          }
        });
        setQuizHistory(Array.from(historyMap.values()));
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || !event.target.files[0]) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      setAvatarUrl(publicUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6"
    >
      {/* Logout Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-200"
              />
              <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </label>
            </div>
            <h2 className="text-2xl font-bold mt-4">{user?.username}</h2>
          </div>

          {/* Quiz History */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Quiz History</h3>
            <div className="space-y-4">
              {quizHistory.map((attempt, index) => (
                <motion.div
                  key={`${attempt.topic}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{attempt.topic}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">{attempt.score}%</p>
                      <p className="text-sm text-gray-500">Rank #{attempt.rank || '-'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {quizHistory.length === 0 && (
                <p className="text-center text-gray-500 py-4">No quizzes completed yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};