// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import{ Login} from '../features/auth/pages/Login';
import {Signup} from '../features/auth/pages/Signup';
import Home from "../pages/home"
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../features/auth/useAuth';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import OrgDashboard from '../features/organization/pages/dashboard';
import { OrganizationLogin } from '../features/auth/pages/OrgLoginPage';
import { OrganizationSignup } from '../features/auth/pages/OrgSignupPage';
import DashboardWrapper from '../components/layout/dashdoardWrapper';

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
        path="/org/login"
        element={!user ?<OrganizationLogin/>: <Navigate to="/org/dashboard" replace />}
      />
      <Route
        path="/org/signup"
        element={!user ? <OrganizationSignup/> : <Navigate to="/org/dashboard" replace />}
      />
   

      {/* user  protected */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        {/* add here protected routes */}
        <Route path='/home' element={ <DashboardWrapper><Home/></DashboardWrapper> }/>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["organization"]} />}>
      <Route path="/org/dashboard" element={<OrgDashboard />} />
      </Route>

      {/* Error */}
      <Route path='/unauthorized' element={<UnauthorizedPage/>}/>


    </Routes>
  );
};

export default AppRouter;
