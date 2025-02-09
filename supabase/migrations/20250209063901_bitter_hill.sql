/*
  # Remove questions table and simplify quiz structure

  1. Changes
    - Remove questions table as content will be stored in JSON files
    - Update quizzes table to store only metadata
    - Keep quiz attempts for tracking scores and rankings

  2. Security
    - Maintain existing RLS policies for remaining tables
*/

-- Drop questions table and related objects
DROP TABLE IF EXISTS questions CASCADE;

-- Modify quizzes table to store only metadata
ALTER TABLE quizzes
DROP COLUMN description,
ADD COLUMN file_name text NOT NULL;

-- Update existing quiz data
UPDATE quizzes
SET file_name = 'bitcoin'
WHERE topic = 'Bitcoin Fundamentals';