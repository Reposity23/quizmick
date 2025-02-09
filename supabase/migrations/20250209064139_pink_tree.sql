/*
  # Remove quiz content and update schema

  1. Changes
    - Drop questions table since content will be in JSON files
    - Update quizzes table to only store metadata
    - Keep quiz_attempts for tracking user progress
    - Keep profiles for user management
  
  2. Security
    - Maintain RLS policies for remaining tables
*/

-- Drop questions table and related objects
DROP TABLE IF EXISTS questions CASCADE;

-- Modify quizzes table to store only metadata
TRUNCATE TABLE quizzes CASCADE;
ALTER TABLE quizzes DROP COLUMN IF EXISTS description;
ALTER TABLE quizzes DROP COLUMN IF EXISTS total_questions;

-- Keep only necessary columns in quizzes
CREATE TABLE IF NOT EXISTS new_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text UNIQUE NOT NULL,
  total_takers integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Move data to new table
INSERT INTO new_quizzes (topic, total_takers, created_at)
SELECT topic, total_takers, created_at
FROM quizzes;

-- Replace old table with new one
DROP TABLE quizzes CASCADE;
ALTER TABLE new_quizzes RENAME TO quizzes;

-- Re-enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Update quiz attempts table
ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempts_quiz_topic_fkey 
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  ON DELETE CASCADE;

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