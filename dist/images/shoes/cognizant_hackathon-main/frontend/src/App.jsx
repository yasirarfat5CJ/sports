import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Predict } from './pages/Predict';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { WhatIf } from './pages/WhatIf';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { authTokenStore, predictionApi } from './services/predictionApi';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// --- REACT ERROR BOUNDARY COMPONENT ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled component crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-panel max-w-md rounded-2xl p-8 space-y-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected component error occurred in the dashboard UI. Please refresh the browser session and try again.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 text-xs font-bold transition-all mx-auto active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!authTokenStore.get()) {
        setIsCheckingSession(false);
        return;
      }

      const result = await predictionApi.me();
      if (result.success) {
        setUser(result.data);
      } else {
        authTokenStore.clear();
      }
      setIsCheckingSession(false);
    };
    restoreSession();
  }, []);

  const handleLogin = (authenticatedUser) => setUser(authenticatedUser);
  const handleLogout = () => {
    predictionApi.logout();
    setUser(null);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" aria-label="Loading session" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col relative">
          {/* Global Ambient Gradients */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

          {/* Navigation Bar */}
          <Navbar user={user} onLogout={handleLogout} />

          {/* Main Application Body */}
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onRegisterSuccess={handleLogin} />} />
              <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
              <Route path="/predict" element={<ProtectedRoute user={user}><Predict /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute user={user} allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute user={user}><About /></ProtectedRoute>} />
              <Route path="/what-if" element={<ProtectedRoute user={user}><WhatIf /></ProtectedRoute>} />
              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
    </div>
  );
}

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}
