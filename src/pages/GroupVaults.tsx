import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Share2, 
  Trophy, 
  Clock, 
  Target,
  Copy,
  MessageCircle,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGroupVaults } from '../hooks/useGroupVaults';
import { useNotifications } from '../hooks/useNotifications';
import { GroupVaultWithMembers } from '../types/database';

const GroupVaults: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState<GroupVaultWithMembers | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [formData, setFormData] = useState({
    vault_name: '',
    target_amount: '',
    target_date: '',
    description: '',
    max_members: '10'
  });

  const { user } = useAuth();
  const { vaults, loading, createVault, joinVault, contribute } = useGroupVaults(user?.id);
  const { createNotification } = useNotifications(user?.id);

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await createVault({
      vault_name: formData.vault_name,
      target_amount: parseFloat(formData.target_amount),
      target_date: formData.target_date,
      description: formData.description,
      max_members: parseInt(formData.max_members),
      is_active: true
    });

    if (!error) {
      setShowCreateModal(false);
      setFormData({
        vault_name: '',
        target_amount: '',
        target_date: '',
        description: '',
        max_members: '10'
      });
      
      await createNotification({
        title: 'Group Vault Created! 🎯',
        message: `Your ${formData.vault_name} squad vault is ready. Share the invite code with your friends!`,
        type: 'achievement'
      });
    }
  };

  const handleJoinVault = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await joinVault(inviteCode);
    
    if (!error && data) {
      setShowJoinModal(false);
      setInviteCode('');
      
      await createNotification({
        title: 'Joined Squad Vault! 🤝',
        message: `Welcome to ${data.vault_name}! Time to start contributing.`,
        type: 'achievement'
      });
    }
  };

  const handleContribute = async (vaultId: string) => {
    if (!contributionAmount) return;
    
    const { error } = await contribute(vaultId, parseFloat(contributionAmount));
    
    if (!error) {
      setContributionAmount('');
      setSelectedVault(null);
      
      await createNotification({
        title: 'Contribution Added! 💰',
        message: `₦${parseFloat(contributionAmount).toLocaleString()} added to your squad vault!`,
        type: 'achievement'
      });
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const getLeaderboard = (vault: GroupVaultWithMembers) => {
    return vault.members
      .sort((a, b) => b.amount_contributed - a.amount_contributed)
      .slice(0, 3);
  };

  const calculateProgress = (vault: GroupVaultWithMembers) => {
    return Math.min((vault.current_amount / vault.target_amount) * 100, 100);
  };

  const getDaysLeft = (targetDate: string) => {
    const today = new Date();
    const deadline = new Date(targetDate);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading squad vaults...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Squad Vaults</h1>
          <p className="text-gray-600">Save together, achieve together 🤝</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
            className="bg-blue-500 text-white p-3 rounded-xl shadow-lg"
          >
            <Share2 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 text-white p-3 rounded-xl shadow-lg"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{vaults.length}</div>
          <div className="text-sm text-gray-600">Active Squads</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {vaults.reduce((sum, vault) => sum + vault.members.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            ₦{vaults.reduce((sum, vault) => sum + vault.current_amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Saved</div>
        </div>
      </motion.div>

      {/* Vaults List */}
      {vaults.length > 0 ? (
        <div className="space-y-4">
          {vaults.map((vault, index) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              {/* Vault Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vault.vault_name}</h3>
                    <p className="text-sm text-gray-600">{vault.members.length} members</p>
                  </div>
                </div>
                
                {vault.owner_id === user?.id && (
                  <button
                    onClick={() => copyInviteCode(vault.invite_code)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Copy size={14} />
                    {vault.invite_code}
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{vault.current_amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    of ₦{vault.target_amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(vault)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-primary-500 h-3 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                  </motion.div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{calculateProgress(vault).toFixed(1)}% Complete</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {getDaysLeft(vault.target_date)} days left
                  </span>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" />
                  Top Contributors
                </h4>
                <div className="space-y-2">
                  {getLeaderboard(vault).map((member, idx) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                          idx === 1 ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.profile.full_name || member.profile.email.split('@')[0]}
                          </p>
                          {idx === 0 && <span className="text-xs text-yellow-600">🔥 Top Saver</span>}
                        </div>
                      </div>
                      <span className="font-semibold text-primary-600">
                        ₦{member.amount_contributed.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVault(vault)}
                  className="flex-1 bg-primary-50 text-primary-600 font-medium py-3 rounded-xl hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign size={16} />
                  Contribute
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Squad Vaults Yet</h3>
          <p className="text-gray-600 mb-6">Create your first squad vault or join one with an invite code!</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Squad Vault
            </button>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="btn-secondary"
            >
              Join with Code
            </button>
          </div>
        </motion.div>
      )}

      {/* Create Vault Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Squad Vault</h2>
            
            <form onSubmit={handleCreateVault} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vault Name
                </label>
                <input
                  type="text"
                  value={formData.vault_name}
                  onChange={(e) => setFormData({ ...formData, vault_name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Trip to Dubai 2025"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount (₦)
                </label>
                <input
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  className="input-field"
                  placeholder="500000"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="What are you saving for?"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Members
                </label>
                <select 
                  value={formData.max_members}
                  onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                  className="input-field"
                >
                  <option value="5">5 members</option>
                  <option value="10">10 members</option>
                  <option value="15">15 members</option>
                  <option value="20">20 members</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Join Vault Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowJoinModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Join Squad Vault</h2>
            
            <form onSubmit={handleJoinVault} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ask your friend for the invite code to join their squad vault
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Join Squad
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Contribute Modal */}
      {selectedVault && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedVault(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contribute to {selectedVault.vault_name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Progress:</span>
                  <span className="font-medium">
                    ₦{selectedVault.current_amount.toLocaleString()} / ₦{selectedVault.target_amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${calculateProgress(selectedVault)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedVault(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleContribute(selectedVault.id)}
                  className="flex-1 btn-primary"
                  disabled={!contributionAmount}
                >
                  Contribute
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GroupVaults;