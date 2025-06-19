import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SavingsGoals from './pages/SavingsGoals';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <div className="pb-20">
                  <Dashboard />
                  <Navigation />
                </div>
              ) : (
                <LandingPage onLogin={() => setIsAuthenticated(true)} />
              )
            } 
          />
          <Route 
            path="/goals" 
            element={
              <div className="pb-20">
                <SavingsGoals />
                <Navigation />
              </div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <div className="pb-20">
                <Profile />
                <Navigation />
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;