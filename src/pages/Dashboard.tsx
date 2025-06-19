import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, TrendingUp, Target, Wallet, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useTransactions } from '../hooks/useTransactions';

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = React.useState(true);
  const { user } = useAuth();
  const { goals, loading: goalsLoading } = useSavingsGoals(user?.id);
  const { transactions, getTotalSavings, loading: transactionsLoading } = useTransactions(user?.id);

  const totalSavings = getTotalSavings();
  const activeGoals = goals.length;

  // Generate chart data from transactions
  const savingsData = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = 0;
    }

    // Aggregate transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        if (transaction.type === 'deposit') {
          monthlyData[monthKey] += transaction.amount;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [transactions]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  if (goalsLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="text-white font-bold text-xl">A</div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, {displayName}!</h1>
            <p className="text-gray-600">Let's check your savings progress</p>
          </div>
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gradient-bg rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Savings</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {showBalance ? `₦${totalSavings.toLocaleString()}` : '₦***,***'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Active Goals</p>
              <p className="text-xl font-semibold">{activeGoals}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} />
            <span>Keep up the great work!</span>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <button className="card text-center hover:shadow-lg transition-all duration-200">
          <PlusCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">Add Money</span>
        </button>
        <button className="card text-center hover:shadow-lg transition-all duration-200">
          <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">New Goal</span>
        </button>
      </motion.div>

      {/* Savings Progress Chart */}
      {savingsData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Savings Progress</h3>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Active Goals */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            <button className="text-primary-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal, index) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{goal.name}</span>
                  <span className="text-sm text-gray-600">
                    ₦{goal.current_amount.toLocaleString()} / ₦{goal.target_amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-primary-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-primary-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'deposit' ? 
                      <Wallet className="w-5 h-5 text-primary-600" /> :
                      <Target className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-primary-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {goals.length === 0 && transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center py-12"
        >
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Savings Journey</h3>
          <p className="text-gray-600 mb-6">Create your first savings goal and begin building wealth.</p>
          <button className="btn-primary">Create Your First Goal</button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;