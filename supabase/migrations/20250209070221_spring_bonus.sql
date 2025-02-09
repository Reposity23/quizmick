-- Add rank column to quiz_attempts if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_attempts' AND column_name = 'rank'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN rank integer;
  END IF;
END $$;

-- Create function to update ranks
CREATE OR REPLACE FUNCTION update_quiz_ranks()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ranks for all attempts of the same quiz
  WITH ranked_attempts AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY quiz_id 
        ORDER BY score DESC, completed_at ASC
      ) as new_rank
    FROM quiz_attempts
    WHERE quiz_id = NEW.quiz_id
  )
  UPDATE quiz_attempts qa
  SET rank = ra.new_rank
  FROM ranked_attempts ra
  WHERE qa.id = ra.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ranks
DROP TRIGGER IF EXISTS update_ranks_after_insert ON quiz_attempts;
CREATE TRIGGER update_ranks_after_insert
  AFTER INSERT OR UPDATE OF score
  ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_ranks();

-- Update existing ranks
WITH ranked_attempts AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY quiz_id 
      ORDER BY score DESC, completed_at ASC
    ) as new_rank
  FROM quiz_attempts
)
UPDATE quiz_attempts qa
SET rank = ra.new_rank
FROM ranked_attempts ra
WHERE qa.id = ra.id;