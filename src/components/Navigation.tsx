import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, User, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/add', icon: PlusCircle, label: 'Add', isSpecial: true },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Icon size={24} className="text-white" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;