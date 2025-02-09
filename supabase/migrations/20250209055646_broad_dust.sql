/*
  # Initial Schema Setup for Quiz Application

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
    - `quizzes`
      - Stores quiz metadata
    - `questions`
      - Stores quiz questions and answers
    - `quiz_attempts`
      - Stores user quiz attempts and scores
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  description text,
  total_questions integer NOT NULL DEFAULT 0,
  total_takers integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  choices jsonb NOT NULL,
  correct_answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  quiz_id uuid REFERENCES quizzes(id),
  score integer NOT NULL DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  rank integer
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Questions policies
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Quiz attempts policies
CREATE POLICY "Users can view all attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_quiz_takers()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quizzes
  SET total_takers = (
    SELECT COUNT(DISTINCT user_id)
    FROM quiz_attempts
    WHERE quiz_id = NEW.quiz_id
  )
  WHERE id = NEW.quiz_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_quiz_takers_after_insert
  AFTER INSERT ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_takers();