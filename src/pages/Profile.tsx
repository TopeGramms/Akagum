import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit,
  Camera
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSavingsGoals } from '../hooks/useSavingsGoals';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { goals } = useSavingsGoals(user?.id);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      subtitle: 'Update your details',
      action: () => console.log('Personal Info')
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage cards and banks',
      action: () => console.log('Payment Methods')
    },
    {
      icon: Shield,
      title: 'Security',
      subtitle: 'Password and 2FA',
      action: () => console.log('Security')
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage alerts',
      action: () => console.log('Notifications')
    },
    {
      icon: Settings,
      title: 'App Settings',
      subtitle: 'Preferences and more',
      action: () => console.log('Settings')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      action: () => console.log('Help')
    }
  ];

  const displayName = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';
  const joinDate = user?.created_at ? new Date(user.created_at) : new Date();
  const monthsSaving = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
              <Camera size={14} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit size={16} className="text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">{email}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-primary-600 font-medium">Verified Account</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{goals.length}</div>
          <div className="text-sm text-gray-600">Active Goals</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{Math.max(monthsSaving, 1)}</div>
          <div className="text-sm text-gray-600">Months Saving</div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            onClick={item.action}
            className="w-full card hover:shadow-md transition-all duration-200 flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <item.icon size={20} className="text-gray-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </motion.button>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleSignOut}
        className="w-full mt-6 card hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 p-4 text-red-600"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </motion.button>

      {/* App Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6 text-sm text-gray-500"
      >
        Akagum v1.0.0
      </motion.div>
    </div>
  );
};

export default Profile;