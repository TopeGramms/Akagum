import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types/database';

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev.slice(0, 9)]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const getTotalSavings = () => {
    return transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0) -
      transactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    getTotalSavings,
    refetch: fetchTransactions,
  };
}