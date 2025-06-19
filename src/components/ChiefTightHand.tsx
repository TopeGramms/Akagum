import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

interface ChiefTightHandProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  type: 'warning' | 'achievement' | 'reminder';
}

const ChiefTightHand: React.FC<ChiefTightHandProps> = ({ 
  isVisible, 
  message, 
  onClose, 
  type 
}) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);

  const getAvatarColor = () => {
    switch (type) {
      case 'warning': return 'bg-red-500';
      case 'achievement': return 'bg-green-500';
      default: return 'bg-primary-500';
    }
  };

  const getMessageBubbleColor = () => {
    switch (type) {
      case 'warning': return 'bg-red-50 border-red-200';
      case 'achievement': return 'bg-green-50 border-green-200';
      default: return 'bg-primary-50 border-primary-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-24 right-4 z-50 max-w-sm"
        >
          <div className="relative">
            {/* Message Bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${getMessageBubbleColor()} border-2 rounded-2xl p-4 mb-2 shadow-lg relative`}
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
              
              <div className="pr-6">
                {isTyping ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">Chief Tight-Hand is typing</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {message}
                  </p>
                )}
              </div>
              
              {/* Speech bubble tail */}
              <div className={`absolute bottom-0 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${
                type === 'warning' ? 'border-t-red-50' : 
                type === 'achievement' ? 'border-t-green-50' : 
                'border-t-primary-50'
              } transform translate-y-full`}></div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex justify-end"
            >
              <div className={`w-12 h-12 ${getAvatarColor()} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                <span className="text-white font-bold text-lg">👨🏾‍💼</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChiefTightHand;