/*
  # Update database schema for JSON-based quizzes

  1. Changes
    - Remove quiz content tables since we're using JSON files
    - Keep only user profiles and attempts tracking
    - Simplify quizzes table to track only metadata
  
  2. Security
    - Maintain RLS policies for remaining tables
*/

-- Drop questions table since we're using JSON files
DROP TABLE IF EXISTS questions CASCADE;

-- Simplify quizzes table
TRUNCATE TABLE quizzes CASCADE;

-- Create new quizzes table with minimal structure
CREATE TABLE IF NOT EXISTS new_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text UNIQUE NOT NULL,
  total_takers integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new table
ALTER TABLE new_quizzes ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Anyone can view quizzes"
  ON new_quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Drop old quizzes table and rename new one
DROP TABLE IF EXISTS quizzes CASCADE;
ALTER TABLE new_quizzes RENAME TO quizzes;

-- Update quiz attempts table
ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempts_quiz_topic_fkey 
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  ON DELETE CASCADE;

-- Create initial quiz entry for bitcoin
INSERT INTO quizzes (topic) VALUES ('Bitcoin Fundamentals');

-- Recreate trigger for updating takers count
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

-- Recreate trigger
DROP TRIGGER IF EXISTS update_quiz_takers_after_insert ON quiz_attempts;
CREATE TRIGGER update_quiz_takers_after_insert
  AFTER INSERT ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_takers();