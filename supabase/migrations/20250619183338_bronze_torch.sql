/*
  # Fix profiles table foreign key constraint

  1. Changes
    - Drop the incorrect foreign key constraint that references a non-existent `users` table
    - Add the correct foreign key constraint that references `auth.users(id)`
    - This ensures proper integration with Supabase's built-in authentication system

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper foreign key relationship
*/

-- Drop the incorrect foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

-- Add the correct foreign key constraint to reference auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey_auth' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey_auth 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;