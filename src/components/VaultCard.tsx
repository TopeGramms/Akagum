import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Calendar, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Shield,
  Flame
} from 'lucide-react';
import { SavingsGoal } from '../types/database';

interface VaultCardProps {
  goal: SavingsGoal;
  onBreakAttempt: (goalId: string) => void;
  onAddMoney: (goalId: string) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ goal, onBreakAttempt, onAddMoney }) => {
  const [showBreakConfirm, setShowBreakConfirm] = useState(false);

  const calculateProgress = () => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const calculateDaysLeft = () => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isUnlockable = () => {
    const daysLeft = calculateDaysLeft();
    const progress = calculateProgress();
    
    switch (goal.lock_type) {
      case 'date':
        return daysLeft <= 0;
      case 'amount':
        return progress >= 100;
      case 'streak':
        return false; // Streak-based unlocking handled elsewhere
      default:
        return false;
    }
  };

  const getStreakDays = () => {
    if (!goal.last_deposit) return 0;
    const lastDeposit = new Date(goal.last_deposit);
    const today = new Date();
    const diffTime = today.getTime() - lastDeposit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays); // Assuming 7-day streak requirement
  };

  const handleBreakAttempt = () => {
    if (goal.vault_type === 'stubborn') {
      onBreakAttempt(goal.id);
    }
    setShowBreakConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-all duration-200 relative overflow-hidden"
    >
      {/* Vault Type Indicator */}
      <div className="absolute top-4 right-4">
        {goal.vault_type === 'stubborn' ? (
          <div className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
            <Shield size={12} />
            Stubborn Mode
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
            <Unlock size={12} />
            Flexible
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-4 pr-20">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900">{goal.name}</h3>
          {goal.is_locked && <Lock size={16} className="text-red-500" />}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{goal.category}</span>
          {goal.break_attempts > 0 && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {goal.break_attempts} break attempts
            </span>
          )}
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">
            ₦{goal.current_amount.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">
            of ₦{goal.target_amount.toLocaleString()}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`${goal.color} h-3 rounded-full relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
          </motion.div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{calculateProgress().toFixed(1)}% Complete</span>
          <span>{calculateDaysLeft()} days left</span>
        </div>
      </div>

      {/* Streak Indicator */}
      {goal.lock_type === 'streak' && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-orange-500" />
            <span className="font-medium text-orange-800">Streak Challenge</span>
          </div>
          <p className="text-sm text-orange-700">
            {getStreakDays()} days until unlock
          </p>
        </div>
      )}

      {/* Lock Status */}
      <div className="mb-4">
        {goal.is_locked ? (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Lock size={16} className="text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Vault Locked</p>
              <p className="text-xs text-red-600">
                {goal.lock_type === 'date' && `Unlocks on ${new Date(goal.deadline).toLocaleDateString()}`}
                {goal.lock_type === 'amount' && `Unlocks when target is reached`}
                {goal.lock_type === 'streak' && `Unlocks after consistent saving streak`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Unlock size={16} className="text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Vault Unlocked</p>
              <p className="text-xs text-green-600">You can withdraw funds</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddMoney(goal.id)}
          className="flex-1 bg-primary-50 text-primary-600 font-medium py-3 rounded-xl hover:bg-primary-100 transition-colors"
        >
          Add Money
        </motion.button>
        
        {goal.is_locked && goal.vault_type === 'stubborn' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBreakConfirm(true)}
            className="px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
          >
            Break Vault
          </motion.button>
        ) : !goal.is_locked ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 bg-green-50 text-green-600 font-medium rounded-xl hover:bg-green-100 transition-colors"
          >
            Withdraw
          </motion.button>
        ) : null}
      </div>

      {/* Break Confirmation Modal */}
      {showBreakConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl"
        >
          <div className="bg-white rounded-xl p-4 max-w-sm w-full">
            <div className="text-center mb-4">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">Break Vault Early?</h3>
              <p className="text-sm text-gray-600">
                This will trigger Chief Tight-Hand's intervention!
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowBreakConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBreakAttempt}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium"
              >
                Break It
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VaultCard;