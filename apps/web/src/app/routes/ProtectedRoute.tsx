// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { useRole } from '../hooks/useRole';

export const ProtectedRoute = ({ allowedRoles }: {allowedRoles :string[]}) => {
  const { user }: { user: any } = useAuth();
  const { role } = useRole();
  console.log(role)
  
  return  allowedRoles.includes(role)?<Outlet/> : user ?<Navigate to="/unauthorized" state={{from : location.pathname}} replace /> :<Navigate to="/login" state={{from : location.pathname}} replace />;
};
