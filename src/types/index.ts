export interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  total_questions: number;
  total_takers: number;
}

export interface Question {
  id: string;
  question: string;
  choices: string[];
  correct_answer: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
  rank: number;
}