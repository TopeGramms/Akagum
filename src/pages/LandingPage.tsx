import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, TrendingUp, Users, Lock, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <div className="text-2xl font-bold text-primary-600">A</div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Save Smart,<br />
              <span className="text-primary-200">Build Wealth</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Akagum is Nigeria's savings brand that helps you realize your money the 
              smart way. Inspired by our culture of financial discipline, we make saving simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Saving Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Akagum?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for Nigerians, by Nigerians. We understand your financial goals and challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Trusted",
                description: "Your money is protected with bank-level security and insurance coverage."
              },
              {
                icon: Target,
                title: "Goal-Oriented Saving",
                description: "Set specific savings goals and track your progress with smart insights."
              },
              {
                icon: TrendingUp,
                title: "Competitive Returns",
                description: "Earn attractive interest rates on your savings with flexible terms."
              },
              {
                icon: Users,
                title: "Community Savings",
                description: "Join savings groups and challenge friends to reach your goals together."
              },
              {
                icon: Lock,
                title: "Disciplined Approach",
                description: "Lock your savings to avoid temptation and build lasting financial habits."
              },
              {
                icon: Smartphone,
                title: "Easy Mobile Access",
                description: "Manage your savings anytime, anywhere with our intuitive mobile app."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Savers" },
              { number: "₦2.5B+", label: "Total Savings" },
              { number: "15%", label: "Average Returns" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of Nigerians who are building wealth through disciplined saving.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;