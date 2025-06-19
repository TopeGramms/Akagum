import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, TrendingUp, Target, Wallet, Eye, EyeOff, Shield, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useTransactions } from '../hooks/useTransactions';
import { useNotifications } from '../hooks/useNotifications';
import { useChiefTightHand } from '../hooks/useChiefTightHand';
import ChiefTightHand from '../components/ChiefTightHand';
import SapaMeter from '../components/SapaMeter';

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const { user } = useAuth();
  const { goals, loading: goalsLoading } = useSavingsGoals(user?.id);
  const { transactions, getTotalSavings, loading: transactionsLoading } = useTransactions(user?.id);
  const { notifications, unreadCount, markAllAsRead } = useNotifications(user?.id);
  const {
    currentMessage,
    isVisible,
    hideMessage,
    triggerReminder
  } = useChiefTightHand();

  const totalSavings = getTotalSavings();
  const activeGoals = goals.length;
  const lockedVaults = goals.filter(g => g.is_locked).length;

  // Calculate Sapa Meter level
  const calculateSapaLevel = () => {
    const totalBreakAttempts = goals.reduce((sum, goal) => sum + goal.break_attempts, 0);
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => 
      (goal.current_amount / goal.target_amount) >= 1
    ).length;
    
    let sapaLevel = 0;
    sapaLevel += totalBreakAttempts * 15;
    if (totalGoals === 0) sapaLevel += 20;
    sapaLevel -= completedGoals * 10;
    
    const lowProgressGoals = goals.filter(goal => 
      (goal.current_amount / goal.target_amount) < 0.3
    ).length;
    sapaLevel += lowProgressGoals * 5;
    
    return Math.max(0, Math.min(100, sapaLevel));
  };

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
  const sapaLevel = calculateSapaLevel();

  // Trigger reminder if user hasn't saved in a while
  React.useEffect(() => {
    if (goals.length > 0 && transactions.length === 0) {
      const timer = setTimeout(() => {
        triggerReminder("Omo, your vaults dey wait for you! Time to feed them! 🍽️💰");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [goals.length, transactions.length, triggerReminder]);

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
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Profile Avatar */}
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 max-h-96 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'achievement' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-red-500' :
                      notification.type === 'chief_tight_hand' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

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
              <p className="text-white/80 text-sm">Locked Vaults</p>
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <p className="text-xl font-semibold">{lockedVaults}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} />
            <span>Keep building that wealth! 💪</span>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <button className="card text-center hover:shadow-lg transition-all duration-200">
          <PlusCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">Add Money</span>
        </button>
        <button className="card text-center hover:shadow-lg transition-all duration-200">
          <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span className="font-medium text-gray-900">New Vault</span>
        </button>
      </motion.div>

      {/* Savings Progress Chart */}
      {savingsData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

      {/* Active Vaults */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Vaults</h3>
            <button className="text-primary-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{goal.name}</span>
                    {goal.is_locked && <Shield size={14} className="text-red-500" />}
                    {goal.vault_type === 'stubborn' && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Stubborn
                      </span>
                    )}
                  </div>
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
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-primary-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
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
          transition={{ delay: 0.4 }}
          className="card text-center py-12"
        >
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Savings Journey</h3>
          <p className="text-gray-600 mb-6">Create your first savings vault and begin building wealth the Akagum way.</p>
          <button className="btn-primary">Create Your First Vault</button>
        </motion.div>
      )}

      {/* Chief Tight-Hand Assistant */}
      <ChiefTightHand
        isVisible={isVisible}
        message={currentMessage?.message || ''}
        type={currentMessage?.type || 'reminder'}
        onClose={hideMessage}
      />
    </div>
  );
};

export default Dashboard;