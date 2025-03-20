import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types/auth';

// Import dashboard components
import ClientDashboard from './components/dashboard/ClientDashboard';
import TaxAgentDashboard from './components/dashboard/TaxAgentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tax-agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.TAX_AGENT]}>
              <TaxAgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root path redirect based on user role */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === UserRole.CLIENT
                    ? '/client/dashboard'
                    : user.role === UserRole.TAX_AGENT
                    ? '/tax-agent/dashboard'
                    : '/admin/dashboard'
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route - redirect to appropriate dashboard or login */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate
                to={
                  user.role === UserRole.CLIENT
                    ? '/client/dashboard'
                    : user.role === UserRole.TAX_AGENT
                    ? '/tax-agent/dashboard'
                    : '/admin/dashboard'
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App; 