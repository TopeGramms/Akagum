/*
  # Enhanced Vault Features Migration

  1. Profile Updates
    - Add savings_streak column
    - Add sapa_meter column  
    - Add total_rewards column

  2. Savings Goals Updates
    - Add vault locking features
    - Add break attempt tracking
    - Add last deposit tracking

  3. Transactions Updates
    - Add streak deposit tracking

  4. New Notifications Table
    - Store system notifications
    - Support different notification types
*/

-- Update profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'savings_streak'
  ) THEN
    ALTER TABLE profiles ADD COLUMN savings_streak integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'sapa_meter'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sapa_meter integer DEFAULT 0 CHECK (sapa_meter >= 0 AND sapa_meter <= 100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_rewards'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_rewards integer DEFAULT 0;
  END IF;
END $$;

-- Update savings_goals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'is_locked'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN is_locked boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'lock_type'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN lock_type text DEFAULT 'date' CHECK (lock_type IN ('date', 'amount', 'streak'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'unlock_condition'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN unlock_condition text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'vault_type'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN vault_type text DEFAULT 'flexible' CHECK (vault_type IN ('flexible', 'stubborn'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'break_attempts'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN break_attempts integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings_goals' AND column_name = 'last_deposit'
  ) THEN
    ALTER TABLE savings_goals ADD COLUMN last_deposit timestamptz;
  END IF;
END $$;

-- Update transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'is_streak_deposit'
  ) THEN
    ALTER TABLE transactions ADD COLUMN is_streak_deposit boolean DEFAULT false;
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('warning', 'achievement', 'reminder', 'chief_tight_hand')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);