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
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];