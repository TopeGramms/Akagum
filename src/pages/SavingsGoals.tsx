import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';

const SavingsGoals: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const goals = [
    {
      id: 1,
      name: 'Emergency Fund',
      target: 200000,
      current: 130000,
      deadline: '2024-12-31',
      color: 'bg-primary-500',
      category: 'Security'
    },
    {
      id: 2,
      name: 'New Car',
      target: 1000000,
      current: 350000,
      deadline: '2025-06-30',
      color: 'bg-blue-500',
      category: 'Transportation'
    },
    {
      id: 3,
      name: 'Vacation to Dubai',
      target: 100000,
      current: 80000,
      deadline: '2024-08-15',
      color: 'bg-yellow-500',
      category: 'Travel'
    },
    {
      id: 4,
      name: 'House Down Payment',
      target: 5000000,
      current: 1200000,
      deadline: '2026-01-01',
      color: 'bg-purple-500',
      category: 'Real Estate'
    }
  ];

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
          <div className="text-2xl font-bold text-primary-600 mb-1">4</div>
          <div className="text-sm text-gray-600">Active Goals</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">₦1.76M</div>
          <div className="text-sm text-gray-600">Total Saved</div>
        </div>
      </motion.div>

      {/* Goals List */}
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
                  ₦{goal.current.toLocaleString()} of ₦{goal.target.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {calculateProgress(goal.current, goal.target).toFixed(1)}% Complete
                </span>
                <span className="text-sm text-gray-500">
                  {calculateDaysLeft(goal.deadline)} days left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`${goal.color} h-3 rounded-full transition-all duration-500`}
                ></motion.div>
              </div>
            </div>

            {/* Goal Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  ₦{(goal.target - goal.current).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  ₦{Math.round((goal.target - goal.current) / calculateDaysLeft(goal.deadline)).toLocaleString()}
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., New Laptop"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount (₦)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="100000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="input-field">
                  <option>Select category</option>
                  <option>Emergency</option>
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Technology</option>
                  <option>Real Estate</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-primary"
              >
                Create Goal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SavingsGoals;