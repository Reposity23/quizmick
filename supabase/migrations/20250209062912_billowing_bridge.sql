/*
  # Insert Bitcoin Quiz Data

  1. New Data
    - Inserts a new Bitcoin quiz into the quizzes table
    - Adds 5 questions for the Bitcoin quiz
  
  2. Content
    - Quiz topic: Bitcoin Fundamentals
    - 5 questions covering Bitcoin basics
    - Multiple choice format (A, B, C, D)
*/

-- Insert Bitcoin quiz
INSERT INTO quizzes (topic, description, total_questions, total_takers)
VALUES (
  'Bitcoin Fundamentals',
  'Test your knowledge about Bitcoin, its history, technology, and key concepts',
  5,
  0
)
RETURNING id INTO quiz_id;

DO $$
DECLARE
  quiz_id uuid;
BEGIN
  -- Get the quiz ID from the previous insert
  SELECT id INTO quiz_id FROM quizzes WHERE topic = 'Bitcoin Fundamentals' LIMIT 1;

  -- Insert questions
  INSERT INTO questions (quiz_id, question, choices, correct_answer) VALUES
  (quiz_id, 'Who is credited with creating Bitcoin?', 
    '["Satoshi Nakamoto", "Vitalik Buterin", "Mark Zuckerberg", "Elon Musk"]',
    'Satoshi Nakamoto'),

  (quiz_id, 'In which year was Bitcoin launched?', 
    '["2008", "2009", "2010", "2011"]',
    '2009'),

  (quiz_id, 'What is the maximum supply of Bitcoin that will ever exist?', 
    '["21 million", "18 million", "25 million", "100 million"]',
    '21 million'),

  (quiz_id, 'What is the process of creating new Bitcoins called?', 
    '["Mining", "Minting", "Printing", "Forging"]',
    'Mining'),

  (quiz_id, 'What is the smallest unit of Bitcoin called?', 
    '["Satoshi", "Bit", "Wei", "Gwei"]',
    'Satoshi');

  -- Update the total questions count
  UPDATE quizzes 
  SET total_questions = 5
  WHERE id = quiz_id;
END $$;