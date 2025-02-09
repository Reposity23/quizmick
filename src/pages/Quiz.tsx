import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getQuizData } from '../lib/quizLoader';
import { Question } from '../types';
import toast from 'react-hot-toast';

export const Quiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDbId, setQuizDbId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadQuizData();
  }, [id]);

  const loadQuizData = async () => {
    try {
      const data = getQuizData(id);
      if (data) {
        setQuizData(data);
        
        // Get or create quiz in database
        const { data: existingQuiz } = await supabase
          .from('quizzes')
          .select('id')
          .eq('topic', data.topic)
          .single();
        
        if (existingQuiz) {
          setQuizDbId(existingQuiz.id);
        } else {
          const { data: newQuiz } = await supabase
            .from('quizzes')
            .insert({ topic: data.topic })
            .select()
            .single();
            
          if (newQuiz) {
            setQuizDbId(newQuiz.id);
          }
        }

        // Load saved progress
        const savedProgress = localStorage.getItem(`quiz_progress_${id}`);
        if (savedProgress) {
          const { currentIndex: savedIndex, selectedAnswers: savedAnswers } = JSON.parse(savedProgress);
          setCurrentIndex(savedIndex);
          setSelectedAnswers(savedAnswers);
        }
      } else {
        toast.error('Quiz not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
      navigate('/');
    }
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = answer;
    setSelectedAnswers(newAnswers);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const correctAnswers = quizData.questions.filter((q: Question, idx: number) => 
        newAnswers[idx] === q.correct_answer
      ).length;
      const finalScore = Math.round((correctAnswers / quizData.questions.length) * 100);
      setScore(finalScore);
      setIsComplete(true);

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user && quizDbId) {
          await supabase.from('quiz_attempts').insert({
            user_id: userData.user.id,
            quiz_id: quizDbId,
            score: finalScore,
          });
        }
        localStorage.removeItem(`quiz_progress_${id}`);
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        toast.error('Error saving quiz results');
      }
    }
  };

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6"
      >
        <div className="max-w-2xl mx-auto glass-effect rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Quiz Complete!</h2>
          <div className="text-center mb-8">
            <p className="text-6xl font-bold gradient-text mb-2">{score}%</p>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="space-y-6 mb-8">
            {quizData.questions.map((question: Question, idx: number) => (
              <div key={question.id} className="p-4 rounded-lg bg-white/50">
                <p className="font-medium mb-4">{question.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {question.shuffledChoices.map((choice: string) => (
                    <div
                      key={choice}
                      className={`p-3 rounded-lg ${
                        choice === question.correct_answer
                          ? 'bg-green-100 border-green-500'
                          : selectedAnswers[idx] === choice && selectedAnswers[idx] !== question.correct_answer
                          ? 'bg-red-100 border-red-500'
                          : 'bg-white/80 border-gray-200'
                      } border transition-all duration-300`}
                    >
                      {choice}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="button-primary"
            >
              Retake Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/rankings')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              View Rankings
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {quizData.questions.length}
          </div>
          <div className="quiz-progress w-64">
            <div
              className="quiz-progress-bar"
              style={{ width: `${((currentIndex + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-effect rounded-lg p-8"
          >
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.shuffledChoices.map((choice: string) => (
                <motion.button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  className={`choice-button ${
                    selectedAnswers[currentIndex] === choice
                      ? 'bg-purple-100 border-purple-500'
                      : 'bg-white/80 hover:bg-gray-100 border-gray-200'
                  } border-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {choice}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};