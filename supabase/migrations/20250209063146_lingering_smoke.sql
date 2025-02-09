/*
  # Create Bitcoin Quiz Data

  1. New Data
    - Adds Bitcoin quiz to quizzes table
    - Adds 20 Bitcoin-related questions
  
  2. Changes
    - Inserts new quiz record
    - Inserts associated questions
*/

DO $$
DECLARE
  quiz_id uuid;
BEGIN
  -- Insert Bitcoin quiz and capture the ID
  INSERT INTO quizzes (topic, description, total_questions, total_takers)
  VALUES (
    'Bitcoin Fundamentals',
    'Test your knowledge about Bitcoin, its history, technology, and key concepts',
    20,
    0
  )
  RETURNING id INTO quiz_id;

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
    'Satoshi'),
    
  (quiz_id, 'What type of technology underlies Bitcoin?', 
    '["Blockchain", "Cloud Computing", "Artificial Intelligence", "Quantum Computing"]',
    'Blockchain'),
    
  (quiz_id, 'How often does Bitcoin halving occur?', 
    '["Every 210,000 blocks", "Every year", "Every 100,000 blocks", "Every 2 years"]',
    'Every 210,000 blocks'),
    
  (quiz_id, 'What is the primary purpose of Bitcoin?', 
    '["Peer-to-peer electronic cash system", "Social media platform", "Cloud storage solution", "Gaming currency"]',
    'Peer-to-peer electronic cash system'),
    
  (quiz_id, 'Which consensus mechanism does Bitcoin use?', 
    '["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated Proof of Stake"]',
    'Proof of Work'),
    
  (quiz_id, 'What is a Bitcoin wallet?', 
    '["Software for storing private keys", "Physical Bitcoin storage", "Bank account", "Mining equipment"]',
    'Software for storing private keys'),
    
  (quiz_id, 'What happens to transaction fees in Bitcoin?', 
    '["Goes to miners", "Gets burned", "Returns to sender", "Goes to developers"]',
    'Goes to miners'),
    
  (quiz_id, 'What is a Bitcoin node?', 
    '["Computer running Bitcoin software", "Mining equipment", "Digital wallet", "Exchange platform"]',
    'Computer running Bitcoin software'),
    
  (quiz_id, 'What is the average time for a Bitcoin block to be mined?', 
    '["10 minutes", "1 hour", "1 minute", "1 day"]',
    '10 minutes'),
    
  (quiz_id, 'What is a Bitcoin address?', 
    '["Public key hash", "Private key", "IP address", "Email address"]',
    'Public key hash'),
    
  (quiz_id, 'What is the size of a Bitcoin block?', 
    '["1 MB", "2 MB", "500 KB", "10 MB"]',
    '1 MB'),
    
  (quiz_id, 'What is a Bitcoin fork?', 
    '["Split in the blockchain", "Mining tool", "Wallet type", "Trading strategy"]',
    'Split in the blockchain'),
    
  (quiz_id, 'What is the Bitcoin mempool?', 
    '["Waiting area for unconfirmed transactions", "Mining pool", "Storage system", "Backup system"]',
    'Waiting area for unconfirmed transactions'),
    
  (quiz_id, 'What is Bitcoin difficulty?', 
    '["Network-wide mining challenge setting", "Price volatility", "Transaction fee", "Block size"]',
    'Network-wide mining challenge setting'),
    
  (quiz_id, 'What is a Bitcoin seed phrase?', 
    '["Recovery words for wallet", "Mining algorithm", "Transaction ID", "Network protocol"]',
    'Recovery words for wallet'),
    
  (quiz_id, 'What is the Bitcoin Lightning Network?', 
    '["Layer 2 scaling solution", "Mining pool", "Exchange platform", "Wallet type"]',
    'Layer 2 scaling solution');
END $$;