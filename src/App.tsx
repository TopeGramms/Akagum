import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Lazy load components to reduce initial bundle size
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SavingsGoals = React.lazy(() => import('./pages/SavingsGoals'));
const GroupVaults = React.lazy(() => import('./pages/GroupVaults'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Navigation = React.lazy(() => import('./components/Navigation'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <div className="text-white font-bold text-xl">A</div>
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/" 
              element={
                user ? (
                  <div className="pb-20">
                    <Dashboard />
                    <Navigation />
                  </div>
                ) : (
                  <LandingPage />
                )
              } 
            />
            <Route 
              path="/goals" 
              element={
                user ? (
                  <div className="pb-20">
                    <SavingsGoals />
                    <Navigation />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/squad" 
              element={
                user ? (
                  <div className="pb-20">
                    <GroupVaults />
                    <Navigation />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? (
                  <div className="pb-20">
                    <Profile />
                    <Navigation />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;