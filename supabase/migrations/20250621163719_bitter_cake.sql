/*
  # Social Squad Saving (Ajo Mode) Feature

  1. New Tables
    - `group_vaults`
      - `id` (uuid, primary key)
      - `vault_name` (text, not null)
      - `owner_id` (uuid, references profiles)
      - `target_amount` (numeric, not null)
      - `current_amount` (numeric, default 0)
      - `target_date` (date, not null)
      - `description` (text)
      - `invite_code` (text, unique)
      - `max_members` (integer, default 10)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `vault_members`
      - `id` (uuid, primary key)
      - `vault_id` (uuid, references group_vaults)
      - `user_id` (uuid, references profiles)
      - `amount_contributed` (numeric, default 0)
      - `joined_at` (timestamptz, default now())
      - `is_active` (boolean, default true)

    - `vault_contributions`
      - `id` (uuid, primary key)
      - `vault_id` (uuid, references group_vaults)
      - `member_id` (uuid, references vault_members)
      - `amount` (numeric, not null)
      - `description` (text)
      - `created_at` (timestamptz, default now())

    - `vault_comments`
      - `id` (uuid, primary key)
      - `vault_id` (uuid, references group_vaults)
      - `user_id` (uuid, references profiles)
      - `message` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all new tables
    - Add policies for vault owners and members
    - Create functions for invite code generation
*/

-- Create group_vaults table
CREATE TABLE IF NOT EXISTS group_vaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_name text NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_amount numeric NOT NULL CHECK (target_amount > 0),
  current_amount numeric DEFAULT 0 CHECK (current_amount >= 0),
  target_date date NOT NULL,
  description text,
  invite_code text UNIQUE NOT NULL,
  max_members integer DEFAULT 10 CHECK (max_members > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vault_members table
CREATE TABLE IF NOT EXISTS vault_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid REFERENCES group_vaults(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_contributed numeric DEFAULT 0 CHECK (amount_contributed >= 0),
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(vault_id, user_id)
);

-- Create vault_contributions table
CREATE TABLE IF NOT EXISTS vault_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid REFERENCES group_vaults(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES vault_members(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create vault_comments table
CREATE TABLE IF NOT EXISTS vault_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid REFERENCES group_vaults(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE group_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_comments ENABLE ROW LEVEL SECURITY;

-- Policies for group_vaults
CREATE POLICY "Users can read vaults they own or are members of"
  ON group_vaults
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM vault_members 
      WHERE vault_id = group_vaults.id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Users can create their own vaults"
  ON group_vaults
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Vault owners can update their vaults"
  ON group_vaults
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Vault owners can delete their vaults"
  ON group_vaults
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policies for vault_members
CREATE POLICY "Users can read vault members for vaults they're part of"
  ON vault_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_vaults 
      WHERE id = vault_id 
      AND (owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM vault_members vm2 
        WHERE vm2.vault_id = vault_id 
        AND vm2.user_id = auth.uid() 
        AND vm2.is_active = true
      ))
    )
  );

CREATE POLICY "Users can join vaults"
  ON vault_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership"
  ON vault_members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for vault_contributions
CREATE POLICY "Users can read contributions for vaults they're part of"
  ON vault_contributions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vault_members 
      WHERE id = member_id 
      AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM group_vaults 
      WHERE id = vault_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Vault members can create contributions"
  ON vault_contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vault_members 
      WHERE id = member_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- Policies for vault_comments
CREATE POLICY "Users can read comments for vaults they're part of"
  ON vault_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_vaults 
      WHERE id = vault_id 
      AND (owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM vault_members 
        WHERE vault_id = vault_comments.vault_id 
        AND user_id = auth.uid() 
        AND is_active = true
      ))
    )
  );

CREATE POLICY "Vault members can create comments"
  ON vault_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM group_vaults 
      WHERE id = vault_id 
      AND (owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM vault_members 
        WHERE vault_id = vault_comments.vault_id 
        AND user_id = auth.uid() 
        AND is_active = true
      ))
    )
  );

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a 6-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM group_vaults WHERE invite_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update vault totals when contributions are added
CREATE OR REPLACE FUNCTION update_vault_totals()
RETURNS trigger AS $$
BEGIN
  -- Update member's total contribution
  UPDATE vault_members 
  SET amount_contributed = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM vault_contributions 
    WHERE member_id = NEW.member_id
  )
  WHERE id = NEW.member_id;
  
  -- Update vault's total amount
  UPDATE group_vaults 
  SET current_amount = (
    SELECT COALESCE(SUM(amount_contributed), 0) 
    FROM vault_members 
    WHERE vault_id = NEW.vault_id AND is_active = true
  ),
  updated_at = now()
  WHERE id = NEW.vault_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating totals
CREATE TRIGGER update_vault_totals_trigger
  AFTER INSERT ON vault_contributions
  FOR EACH ROW EXECUTE FUNCTION update_vault_totals();

-- Create trigger for updated_at on group_vaults
CREATE TRIGGER update_group_vaults_updated_at
  BEFORE UPDATE ON group_vaults
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_vaults_owner_id ON group_vaults(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_vaults_invite_code ON group_vaults(invite_code);
CREATE INDEX IF NOT EXISTS idx_vault_members_vault_id ON vault_members(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_members_user_id ON vault_members(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_contributions_vault_id ON vault_contributions(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_contributions_member_id ON vault_contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_vault_comments_vault_id ON vault_comments(vault_id);