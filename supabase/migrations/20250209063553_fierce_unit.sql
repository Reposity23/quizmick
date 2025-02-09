/*
  # Create Missing Profiles
  
  1. Changes
    - Create profiles for any existing users that don't have one
    - Ensure profile exists before quiz attempts
  
  2. Security
    - Maintains existing RLS policies
*/

-- Create profiles for existing users
INSERT INTO public.profiles (id, username)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'username', 'user_' || substr(id::text, 1, 8))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;