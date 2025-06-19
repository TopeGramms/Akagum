import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SavingsGoals from './pages/SavingsGoals';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-white font-bold text-xl">A</div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
      </div>
    </Router>
  );
}

export default App;