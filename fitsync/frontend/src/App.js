import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import SplashPage       from './pages/SplashPage';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import OnboardWeight    from './pages/onboarding/OnboardWeight';
import OnboardHeight    from './pages/onboarding/OnboardHeight';
import OnboardGoal      from './pages/onboarding/OnboardGoal';
import TransformPage    from './pages/TransformPage';
import HomePage         from './pages/HomePage';
import SchedulePage     from './pages/SchedulePage';
import StatsPage        from './pages/StatsPage';
import ProfilePage      from './pages/ProfilePage';
import ChatPage         from './pages/ChatPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}><span className="spinner" /></div>;
  return user ? children : <Navigate to="/" replace />;
};

const OnboardRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.onboardingComplete) return <Navigate to="/home" replace />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}><span className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/"          element={!user ? <SplashPage /> : <Navigate to={user.onboardingComplete ? '/home' : '/onboard/weight'} replace />} />
      <Route path="/start"     element={!user ? <LandingPage /> : <Navigate to="/home" replace />} />
      <Route path="/login"     element={!user ? <LoginPage /> : <Navigate to="/home" replace />} />
      <Route path="/register"  element={!user ? <RegisterPage /> : <Navigate to="/home" replace />} />

      <Route path="/onboard/weight" element={<OnboardRoute><OnboardWeight /></OnboardRoute>} />
      <Route path="/onboard/height" element={<OnboardRoute><OnboardHeight /></OnboardRoute>} />
      <Route path="/onboard/goal"   element={<OnboardRoute><OnboardGoal /></OnboardRoute>} />
      <Route path="/transform"      element={<PrivateRoute><TransformPage /></PrivateRoute>} />

      <Route path="/home"     element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
      <Route path="/stats"    element={<PrivateRoute><StatsPage /></PrivateRoute>} />
      <Route path="/profile"  element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/chat"     element={<PrivateRoute><ChatPage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
