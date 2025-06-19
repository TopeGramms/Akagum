import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSavingsGoals } from '../hooks/useSavingsGoals';

const SavingsGoals: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    target_amount: '',
    deadline: '',
    category: '',
    color: 'bg-primary-500'
  });

  const { user } = useAuth();
  const { goals, loading, createGoal, deleteGoal } = useSavingsGoals(user?.id);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await createGoal({
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: 0,
      deadline: formData.deadline,
      category: formData.category,
      color: formData.color
    });

    if (!error) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        target_amount: '',
        deadline: '',
        category: '',
        color: 'bg-primary-500'
      });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your goals...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track and achieve your financial targets</p>
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

      {/* Goals Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{goals.length}</div>
          <div className="text-sm text-gray-600">Active Goals</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">₦{totalSaved.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Saved</div>
        </div>
      </motion.div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    ₦{goal.current_amount.toLocaleString()} of ₦{goal.target_amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit size={16} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {calculateProgress(goal.current_amount, goal.target_amount).toFixed(1)}% Complete
                  </span>
                  <span className="text-sm text-gray-500">
                    {calculateDaysLeft(goal.deadline)} days left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(goal.current_amount, goal.target_amount)}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`${goal.color} h-3 rounded-full transition-all duration-500`}
                  ></motion.div>
                </div>
              </div>

              {/* Goal Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    ₦{(goal.target_amount - goal.current_amount).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    ₦{Math.max(Math.round((goal.target_amount - goal.current_amount) / Math.max(calculateDaysLeft(goal.deadline), 1)), 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Per Day</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(goal.deadline).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-xs text-gray-500">Deadline</div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-primary-50 text-primary-600 font-medium py-3 rounded-xl hover:bg-primary-100 transition-colors"
              >
                Add to Goal
              </motion.button>
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
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-6">Create your first savings goal to start building wealth.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Goal
          </button>
        </motion.div>
      )}

      {/* Create Goal Modal */}
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
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Goal</h2>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., New Laptop"
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
                  placeholder="100000"
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
                  <option value="Emergency">Emergency</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
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
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SavingsGoals;