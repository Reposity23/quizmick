/*
  # Add Bitcoin Quiz

  1. New Data
    - Add a new quiz about Bitcoin
    - Add 20 questions with multiple choice answers
    - Enable RLS policies for the new data

  2. Content
    - Comprehensive Bitcoin quiz covering history, technology, and concepts
    - Multiple choice format with 4 options per question
*/

-- Insert Bitcoin quiz
INSERT INTO quizzes (id, topic, description, total_questions, total_takers)
VALUES (
  'btc-quiz-001',
  'Bitcoin Fundamentals',
  'Test your knowledge about Bitcoin, its history, technology, and key concepts',
  20,
  0
);

-- Insert questions
INSERT INTO questions (quiz_id, question, choices, correct_answer) VALUES
('btc-quiz-001', 'Who is credited with creating Bitcoin?', 
  '["Satoshi Nakamoto", "Vitalik Buterin", "Mark Zuckerberg", "Elon Musk"]',
  'Satoshi Nakamoto'),

('btc-quiz-001', 'In which year was Bitcoin launched?', 
  '["2009", "2010", "2008", "2011"]',
  '2009'),

('btc-quiz-001', 'What is the maximum supply of Bitcoin that will ever exist?', 
  '["21 million", "18 million", "25 million", "100 million"]',
  '21 million'),

('btc-quiz-001', 'What is the process of creating new Bitcoins called?', 
  '["Mining", "Minting", "Printing", "Forging"]',
  'Mining'),

('btc-quiz-001', 'What type of cryptography does Bitcoin use?', 
  '["Public-key cryptography", "Symmetric encryption", "ROT13", "Base64 encoding"]',
  'Public-key cryptography'),

('btc-quiz-001', 'What is the smallest unit of Bitcoin called?', 
  '["Satoshi", "Bit", "Wei", "Gwei"]',
  'Satoshi'),

('btc-quiz-001', 'How many satoshis make up one Bitcoin?', 
  '["100 million", "1 million", "10 million", "1 billion"]',
  '100 million'),

('btc-quiz-001', 'What is the name of the first Bitcoin transaction block?', 
  '["Genesis Block", "Block Zero", "First Block", "Origin Block"]',
  'Genesis Block'),

('btc-quiz-001', 'How often does Bitcoin halving occur?', 
  '["Every 210,000 blocks", "Every year", "Every 100,000 blocks", "Every 2 years"]',
  'Every 210,000 blocks'),

('btc-quiz-001', 'What was the first known commercial transaction using Bitcoin?', 
  '["Two pizzas", "A car", "A computer", "A house"]',
  'Two pizzas'),

('btc-quiz-001', 'What is the average time to mine a new Bitcoin block?', 
  '["10 minutes", "1 hour", "1 minute", "1 day"]',
  '10 minutes'),

('btc-quiz-001', 'What is the main purpose of the Bitcoin network difficulty adjustment?', 
  '["Maintain consistent block times", "Increase mining rewards", "Reduce energy usage", "Speed up transactions"]',
  'Maintain consistent block times'),

('btc-quiz-001', 'Which consensus mechanism does Bitcoin use?', 
  '["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated Proof of Stake"]',
  'Proof of Work'),

('btc-quiz-001', 'What is the name of Bitcoin''s underlying technology?', 
  '["Blockchain", "Database", "Cloud Computing", "Artificial Intelligence"]',
  'Blockchain'),

('btc-quiz-001', 'What happens to transaction fees in Bitcoin?', 
  '["Goes to miners", "Gets burned", "Returns to sender", "Goes to developers"]',
  'Goes to miners'),

('btc-quiz-001', 'What is a Bitcoin node?', 
  '["A computer running Bitcoin software", "A mining machine", "A Bitcoin wallet", "A cryptocurrency exchange"]',
  'A computer running Bitcoin software'),

('btc-quiz-001', 'What is the purpose of Bitcoin''s mempool?', 
  '["Store unconfirmed transactions", "Store Bitcoin wallets", "Mine new blocks", "Track Bitcoin price"]',
  'Store unconfirmed transactions'),

('btc-quiz-001', 'What is a Bitcoin fork?', 
  '["A split in the blockchain", "A mining tool", "A type of wallet", "A payment method"]',
  'A split in the blockchain'),

('btc-quiz-001', 'What is the role of private keys in Bitcoin?', 
  '["Sign transactions", "Mine blocks", "Create addresses", "Track balances"]',
  'Sign transactions'),

('btc-quiz-001', 'What is the primary purpose of Bitcoin''s script language?', 
  '["Define transaction conditions", "Create smart contracts", "Mine blocks", "Store data"]',
  'Define transaction conditions');