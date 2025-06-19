import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Shield, Unlock, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useChiefTightHand } from '../hooks/useChiefTightHand';
import { useNotifications } from '../hooks/useNotifications';
import VaultCard from '../components/VaultCard';
import ChiefTightHand from '../components/ChiefTightHand';
import SapaMeter from '../components/SapaMeter';

const SavingsGoals: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    category: '',
    color: 'bg-primary-500',
    vault_type: 'flexible' as 'flexible' | 'stubborn',
    lock_type: 'date' as 'date' | 'amount' | 'streak'
  });

  const { user } = useAuth();
  const { goals, loading, createGoal, updateGoal } = useSavingsGoals(user?.id);
  const { createNotification } = useNotifications(user?.id);
  const {
    currentMessage,
    isVisible,
    hideMessage,
    triggerBreakAttemptWarning,
    triggerAchievement
  } = useChiefTightHand();

  // Calculate Sapa Meter level based on break attempts and savings behavior
  const calculateSapaLevel = () => {
    const totalBreakAttempts = goals.reduce((sum, goal) => sum + goal.break_attempts, 0);
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => 
      (goal.current_amount / goal.target_amount) >= 1
    ).length;
    
    let sapaLevel = 0;
    
    // Add points for break attempts (each attempt adds 15 points)
    sapaLevel += totalBreakAttempts * 15;
    
    // Add points if no goals exist (20 points)
    if (totalGoals === 0) sapaLevel += 20;
    
    // Subtract points for completed goals (each completion removes 10 points)
    sapaLevel -= completedGoals * 10;
    
    // Add points for goals with low progress (5 points each)
    const lowProgressGoals = goals.filter(goal => 
      (goal.current_amount / goal.target_amount) < 0.3
    ).length;
    sapaLevel += lowProgressGoals * 5;
    
    return Math.max(0, Math.min(100, sapaLevel));
  };

  const handleBreakAttempt = async (goalId: string) => {
    // Increment break attempts
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      await updateGoal(goalId, { 
        break_attempts: goal.break_attempts + 1 
      });
      
      // Create notification
      await createNotification({
        title: 'Vault Break Attempt!',
        message: 'Chief Tight-Hand is not pleased with your attempt to break the vault early!',
        type: 'chief_tight_hand'
      });
      
      // Trigger Chief Tight-Hand warning
      triggerBreakAttemptWarning();
    }
  };

  const handleAddMoney = async (goalId: string) => {
    // This would open a modal to add money
    // For now, just trigger an achievement message
    triggerAchievement("Ehen! That's the spirit! Keep feeding that vault! 💪");
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await createGoal({
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: 0,
      deadline: formData.deadline,
      category: formData.category,
      color: formData.color,
      is_locked: formData.vault_type === 'stubborn',
      lock_type: formData.lock_type,
      unlock_condition: formData.deadline,
      vault_type: formData.vault_type,
      break_attempts: 0,
      last_deposit: null
    });

    if (!error) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        target_amount: '',
        deadline: '',
        category: '',
        color: 'bg-primary-500',
        vault_type: 'flexible',
        lock_type: 'date'
      });
      
      // Create welcome notification for new vault
      await createNotification({
        title: 'New Vault Created! 🎯',
        message: `Your ${formData.name} vault is ready. Time to start saving!`,
        type: 'achievement'
      });
      
      triggerAchievement("New vault created! Now show it some love with consistent deposits! 🏦💕");
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const sapaLevel = calculateSapaLevel();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your vaults...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Savings Vaults</h1>
          <p className="text-gray-600">Lock your money, secure your future</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-500 text-white p-3 rounded-xl shadow-lg"
        >
          <Plus size={24} />
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{goals.length}</div>
          <div className="text-sm text-gray-600">Active Vaults</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">₦{totalSaved.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Locked</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {goals.filter(g => g.vault_type === 'stubborn').length}
          </div>
          <div className="text-sm text-gray-600">Stubborn Vaults</div>
        </div>
      </motion.div>

      {/* Sapa Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <SapaMeter level={sapaLevel} />
      </motion.div>

      {/* Vaults List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <VaultCard
                goal={goal}
                onBreakAttempt={handleBreakAttempt}
                onAddMoney={handleAddMoney}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center py-12"
        >
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vaults Yet</h3>
          <p className="text-gray-600 mb-6">Create your first savings vault and lock away your money for the future!</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Vault
          </button>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Vault</h2>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vault Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., House Rent, Business Capital"
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
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Rent">Rent</option>
                  <option value="Business">Business Capital</option>
                  <option value="Emergency">Emergency Fund</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Vault Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vault Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="vault_type"
                      value="flexible"
                      checked={formData.vault_type === 'flexible'}
                      onChange={(e) => setFormData({ ...formData, vault_type: e.target.value as 'flexible' | 'stubborn' })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Unlock size={16} className="text-blue-500" />
                        <span className="font-medium text-gray-900">Flexible Vault</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        You can withdraw anytime. Good for beginners.
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="vault_type"
                      value="stubborn"
                      checked={formData.vault_type === 'stubborn'}
                      onChange={(e) => setFormData({ ...formData, vault_type: e.target.value as 'flexible' | 'stubborn' })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={16} className="text-red-500" />
                        <span className="font-medium text-gray-900">Stubborn Akagum Mode</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Locked tight! Chief Tight-Hand will stop you from breaking it early.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Lock Type (only for stubborn vaults) */}
              {formData.vault_type === 'stubborn' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Unlock Condition
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lock_type"
                        value="date"
                        checked={formData.lock_type === 'date'}
                        onChange={(e) => setFormData({ ...formData, lock_type: e.target.value as 'date' | 'amount' | 'streak' })}
                      />
                      <span className="text-sm">Unlock on target date</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lock_type"
                        value="amount"
                        checked={formData.lock_type === 'amount'}
                        onChange={(e) => setFormData({ ...formData, lock_type: e.target.value as 'date' | 'amount' | 'streak' })}
                      />
                      <span className="text-sm">Unlock when target amount is reached</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lock_type"
                        value="streak"
                        checked={formData.lock_type === 'streak'}
                        onChange={(e) => setFormData({ ...formData, lock_type: e.target.value as 'date' | 'amount' | 'streak' })}
                      />
                      <span className="text-sm">Unlock after 30-day saving streak</span>
                    </label>
                  </div>
                </div>
              )}
              
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
                  Create Vault
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Chief Tight-Hand Assistant */}
      <ChiefTightHand
        isVisible={isVisible}
        message={currentMessage?.message || ''}
        type={currentMessage?.type || 'warning'}
        onClose={hideMessage}
      />
    </div>
  );
};

export default SavingsGoals;