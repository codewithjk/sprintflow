// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import{ Login} from '../features/auth/pages/Login';
import {Signup} from '../features/auth/pages/Signup';
import {VerifyOtp} from '../features/auth/pages/VerifyOtp';
import Home from "../pages/home"
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../features/auth/useAuth';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth pages (only visible if NOT logged in) */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/verify"
        element={!user ? <VerifyOtp /> : <Navigate to="/home" replace />}
      />

      {/* Protected */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }
      />

      {/* More routes like project, org etc... */}
    </Routes>
  );
};

export default AppRouter;
