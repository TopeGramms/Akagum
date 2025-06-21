export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          savings_streak: number;
          sapa_meter: number;
          total_rewards: number;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          savings_streak?: number;
          sapa_meter?: number;
          total_rewards?: number;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          savings_streak?: number;
          sapa_meter?: number;
          total_rewards?: number;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string;
          category: string;
          color: string;
          created_at: string;
          updated_at: string;
          is_locked: boolean;
          lock_type: 'date' | 'amount' | 'streak';
          unlock_condition: string;
          vault_type: 'flexible' | 'stubborn';
          break_attempts: number;
          last_deposit: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline: string;
          category: string;
          color: string;
          created_at?: string;
          updated_at?: string;
          is_locked?: boolean;
          lock_type?: 'date' | 'amount' | 'streak';
          unlock_condition?: string;
          vault_type?: 'flexible' | 'stubborn';
          break_attempts?: number;
          last_deposit?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string;
          category?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
          is_locked?: boolean;
          lock_type?: 'date' | 'amount' | 'streak';
          unlock_condition?: string;
          vault_type?: 'flexible' | 'stubborn';
          break_attempts?: number;
          last_deposit?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string | null;
          amount: number;
          type: 'deposit' | 'withdrawal';
          description: string;
          created_at: string;
          is_streak_deposit: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id?: string | null;
          amount: number;
          type: 'deposit' | 'withdrawal';
          description: string;
          created_at?: string;
          is_streak_deposit?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string | null;
          amount?: number;
          type?: 'deposit' | 'withdrawal';
          description?: string;
          created_at?: string;
          is_streak_deposit?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'warning' | 'achievement' | 'reminder' | 'chief_tight_hand';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: 'warning' | 'achievement' | 'reminder' | 'chief_tight_hand';
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'warning' | 'achievement' | 'reminder' | 'chief_tight_hand';
          is_read?: boolean;
          created_at?: string;
        };
      };
      group_vaults: {
        Row: {
          id: string;
          vault_name: string;
          owner_id: string;
          target_amount: number;
          current_amount: number;
          target_date: string;
          description: string | null;
          invite_code: string;
          max_members: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vault_name: string;
          owner_id: string;
          target_amount: number;
          current_amount?: number;
          target_date: string;
          description?: string | null;
          invite_code: string;
          max_members?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vault_name?: string;
          owner_id?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string;
          description?: string | null;
          invite_code?: string;
          max_members?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vault_members: {
        Row: {
          id: string;
          vault_id: string;
          user_id: string;
          amount_contributed: number;
          joined_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          vault_id: string;
          user_id: string;
          amount_contributed?: number;
          joined_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          vault_id?: string;
          user_id?: string;
          amount_contributed?: number;
          joined_at?: string;
          is_active?: boolean;
        };
      };
      vault_contributions: {
        Row: {
          id: string;
          vault_id: string;
          member_id: string;
          amount: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vault_id: string;
          member_id: string;
          amount: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vault_id?: string;
          member_id?: string;
          amount?: number;
          description?: string | null;
          created_at?: string;
        };
      };
      vault_comments: {
        Row: {
          id: string;
          vault_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vault_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vault_id?: string;
          user_id?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type GroupVault = Database['public']['Tables']['group_vaults']['Row'];
export type VaultMember = Database['public']['Tables']['vault_members']['Row'];
export type VaultContribution = Database['public']['Tables']['vault_contributions']['Row'];
export type VaultComment = Database['public']['Tables']['vault_comments']['Row'];

// Extended types with joined data
export interface GroupVaultWithMembers extends GroupVault {
  members: (VaultMember & { profile: Profile })[];
  owner: Profile;
}

export interface VaultMemberWithProfile extends VaultMember {
  profile: Profile;
}