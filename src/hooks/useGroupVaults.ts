import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GroupVault, GroupVaultWithMembers, VaultMember, VaultContribution } from '../types/database';

export function useGroupVaults(userId: string | undefined) {
  const [vaults, setVaults] = useState<GroupVaultWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchVaults();
  }, [userId]);

  const fetchVaults = async () => {
    try {
      setLoading(true);
      
      // Fetch vaults where user is owner or member
      const { data: vaultsData, error: vaultsError } = await supabase
        .from('group_vaults')
        .select(`
          *,
          owner:profiles!group_vaults_owner_id_fkey(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (vaultsError) throw vaultsError;

      // Fetch members for each vault
      const vaultsWithMembers = await Promise.all(
        (vaultsData || []).map(async (vault) => {
          const { data: membersData, error: membersError } = await supabase
            .from('vault_members')
            .select(`
              *,
              profile:profiles(*)
            `)
            .eq('vault_id', vault.id)
            .eq('is_active', true)
            .order('amount_contributed', { ascending: false });

          if (membersError) throw membersError;

          return {
            ...vault,
            members: membersData || []
          };
        })
      );

      setVaults(vaultsWithMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createVault = async (vault: Omit<GroupVault, 'id' | 'owner_id' | 'current_amount' | 'created_at' | 'updated_at' | 'invite_code'>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      // Generate invite code
      const { data: inviteCodeData, error: inviteCodeError } = await supabase
        .rpc('generate_invite_code');

      if (inviteCodeError) throw inviteCodeError;

      const { data, error } = await supabase
        .from('group_vaults')
        .insert([{ 
          ...vault, 
          owner_id: userId,
          invite_code: inviteCodeData
        }])
        .select()
        .single();

      if (error) throw error;

      // Add owner as first member
      await supabase
        .from('vault_members')
        .insert([{
          vault_id: data.id,
          user_id: userId
        }]);

      await fetchVaults();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const joinVault = async (inviteCode: string) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      // Find vault by invite code
      const { data: vaultData, error: vaultError } = await supabase
        .from('group_vaults')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (vaultError) throw new Error('Invalid invite code');

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('vault_members')
        .select('*')
        .eq('vault_id', vaultData.id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this vault');
      }

      // Check if vault is full
      const { count } = await supabase
        .from('vault_members')
        .select('*', { count: 'exact' })
        .eq('vault_id', vaultData.id)
        .eq('is_active', true);

      if (count && count >= vaultData.max_members) {
        throw new Error('This vault is full');
      }

      // Add user as member
      const { data, error } = await supabase
        .from('vault_members')
        .insert([{
          vault_id: vaultData.id,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchVaults();
      return { data: vaultData, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const contribute = async (vaultId: string, amount: number, description?: string) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      // Get member ID
      const { data: memberData, error: memberError } = await supabase
        .from('vault_members')
        .select('*')
        .eq('vault_id', vaultId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (memberError) throw new Error('You are not a member of this vault');

      // Add contribution
      const { data, error } = await supabase
        .from('vault_contributions')
        .insert([{
          vault_id: vaultId,
          member_id: memberData.id,
          amount,
          description
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchVaults();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  const getVaultContributions = async (vaultId: string) => {
    try {
      const { data, error } = await supabase
        .from('vault_contributions')
        .select(`
          *,
          member:vault_members!vault_contributions_member_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('vault_id', vaultId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  return {
    vaults,
    loading,
    error,
    createVault,
    joinVault,
    contribute,
    getVaultContributions,
    refetch: fetchVaults,
  };
}