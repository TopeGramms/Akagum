import { useState, useCallback } from 'react';

interface ChiefTightHandMessage {
  message: string;
  type: 'warning' | 'achievement' | 'reminder';
}

const NIGERIAN_MESSAGES = {
  breakAttempt: [
    "Omo, na this kind spending dey cause premium sapa! 😤",
    "You dey plan flex or save? Pick struggle, my gee! 🤔",
    "Unless those sneakers go make you millionaire, my answer na NO! 👟❌",
    "Wetin you wan use the money do? Buy air? 🌬️💸",
    "My friend, your future self go thank you if you no touch am! 🙏",
    "Na so dem dey start - small small, then GBAM! Sapa don land! 💥",
    "You think say money dey grow for tree? Plant patience instead! 🌳",
    "Chief, this one na temptation. Resist am like bad belle! 😈",
  ],
  achievement: [
    "Ehen! Now you dey talk! Keep am up! 🔥",
    "See as you dey save like pro! I dey proud of you! 💪",
    "Your discipline strong pass garri! Well done! 🍚✨",
    "This na the way! Your bank account go thank you later! 🏦❤️",
    "You don dey understand the assignment! Continue! 📚✅",
    "See financial discipline! You fit teach masterclass! 🎓",
    "Your future self don dey smile already! Keep going! 😊",
  ],
  reminder: [
    "Oya, time to add money to your vault! No dulling! ⏰",
    "Your savings goal dey wait for you o! Show am love! 💕",
    "Small small na im dey build house. Add something today! 🏠",
    "Even ₦100 better pass nothing. Every kobo count! 💰",
    "Your discipline strong, but consistency stronger! 💪",
    "Make I remind you - your future self dey count on you! 🔮",
  ]
};

export function useChiefTightHand() {
  const [currentMessage, setCurrentMessage] = useState<ChiefTightHandMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showMessage = useCallback((type: 'warning' | 'achievement' | 'reminder', customMessage?: string) => {
    let message: string;
    
    if (customMessage) {
      message = customMessage;
    } else {
      const messages = NIGERIAN_MESSAGES[type === 'warning' ? 'breakAttempt' : type];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    setCurrentMessage({ message, type });
    setIsVisible(true);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 8000);
  }, []);

  const hideMessage = useCallback(() => {
    setIsVisible(false);
  }, []);

  const triggerBreakAttemptWarning = useCallback(() => {
    showMessage('warning');
  }, [showMessage]);

  const triggerAchievement = useCallback((customMessage?: string) => {
    showMessage('achievement', customMessage);
  }, [showMessage]);

  const triggerReminder = useCallback((customMessage?: string) => {
    showMessage('reminder', customMessage);
  }, [showMessage]);

  return {
    currentMessage,
    isVisible,
    showMessage,
    hideMessage,
    triggerBreakAttemptWarning,
    triggerAchievement,
    triggerReminder,
  };
}