import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface SapaMeterProps {
  level: number; // 0-100
  className?: string;
}

const SapaMeter: React.FC<SapaMeterProps> = ({ level, className = '' }) => {
  const getSapaStatus = () => {
    if (level <= 20) return { text: 'Financial Discipline Strong 💪', color: 'text-green-600', icon: TrendingUp };
    if (level <= 40) return { text: 'Dey Try Small 😊', color: 'text-blue-600', icon: TrendingUp };
    if (level <= 60) return { text: 'Wahala Dey Come 😬', color: 'text-yellow-600', icon: AlertTriangle };
    if (level <= 80) return { text: 'Premium Sapa Loading... 😰', color: 'text-orange-600', icon: TrendingDown };
    return { text: 'Chief Sapa Don Arrive! 🚨', color: 'text-red-600', icon: AlertTriangle };
  };

  const getMeterColor = () => {
    if (level <= 20) return 'bg-green-500';
    if (level <= 40) return 'bg-blue-500';
    if (level <= 60) return 'bg-yellow-500';
    if (level <= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const status = getSapaStatus();
  const StatusIcon = status.icon;

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <StatusIcon size={20} className={status.color} />
          Sapa Meter
        </h3>
        <span className="text-2xl font-bold text-gray-900">{level}%</span>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${getMeterColor()} rounded-full relative`}
          >
            {level > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
            )}
          </motion.div>
        </div>
      </div>
      
      <p className={`text-sm font-medium ${status.color} text-center`}>
        {status.text}
      </p>
      
      {level > 60 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-xs text-yellow-800 text-center">
            {level > 80 ? 
              "Omo, you need serious intervention! 😅" : 
              "Time to tighten that belt, my gee! 🎯"
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SapaMeter;