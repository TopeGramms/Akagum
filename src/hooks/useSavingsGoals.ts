import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SavingsGoal } from '../types/database';

export function useSavingsGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{ ...goal, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const updateGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      setGoals(prev => prev.filter(goal => goal.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { error };
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}