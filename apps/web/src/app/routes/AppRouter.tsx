// src/routes/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import{ Login} from '../features/auth/pages/Login';

import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../features/auth/useAuth';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import OrgDashboard from '../features/organization/pages/dashboard';
import { OrganizationLogin } from '../features/auth/pages/OrgLoginPage';
import { OrganizationSignup } from '../features/auth/pages/OrgSignupPage';
import DashboardWrapper from '../components/layout/dashdoardWrapper';
import {  ProjectViewPage } from '../features/project/pages';
import { ProjectListPage } from '../features/project/pages/ProjectListPage';
import { PriorityPage } from '../features/task/pages/PriorityPage';
import { Priority } from '../types/state.type';
import InviteHandlingPage from '../features/auth/pages/InviteHandlingPage';
import { MembersPage } from '../features/organization/pages/membersPage';
import { UserRegistrationPage } from '../features/auth/pages/UserRegistrationPage';
import { PlansPage } from '../features/organization/pages/plansPage';
import { useAppSelector } from '../store/hooks';
import { useEffect } from 'react';
import { OrgSettingsPage } from '../features/organization/pages/OrgsettingsPage';
import { HomePage } from '../pages/home';
import { MeetingPage } from '../features/meetings/pages/MeetingPage';
import { AdminPanel } from '../features/admin/pages/adminPanel';
import { AdminLogin } from '../features/auth/pages/AdminLoginPage';
import {NotFoundPage }from '../pages/NotFoundPage';
import { UsersListPage } from '../features/admin/pages/usersList';
import { OrganizationsListPage } from '../features/admin/pages/OrganizationListPage';
import { ChatPage } from '../features/chat/pages/ChatPage';
import { TimeLinePage } from '../pages/TimelinePage';
import { UserSettingsPage } from '../pages/UserSettings';
import { PaymentListPage } from '../features/admin/pages/paymentList';
import LandingPage from '../pages/LandingPage';

const AppRouter = () => {
  const { user } = useAuth();
   const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

  return (
    <Routes>
        <Route
        path="/"
        element={<LandingPage/>}
      />
      
      {/* Auth pages (only visible if NOT logged in) */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/register"
        element={!user ? <UserRegistrationPage /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/invite/:token"
        element={<InviteHandlingPage/>}
      />
      <Route
        path="/org/login"
        element={!user  ?<OrganizationLogin/>: <Navigate to="/org/dashboard" replace />}
      />
      <Route
        path="/org/signup"
        element={!user ? <OrganizationSignup/> : <Navigate to="/org/dashboard" replace />}
      />

      <Route
        path="/admin/login"
        element={!user  ?<AdminLogin/>: <Navigate to="/admin/dashboard" replace />}
      />

      {/* user  protected */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>

        <Route path='/home' element={<DashboardWrapper><HomePage /></DashboardWrapper>} />
        <Route path="/chat/" element={<DashboardWrapper><ChatPage /></DashboardWrapper>} />
        <Route path="/timeline/" element={<DashboardWrapper><TimeLinePage/></DashboardWrapper>} />
        <Route path="/settings/" element={<DashboardWrapper><UserSettingsPage/></DashboardWrapper>} />
        
      </Route>


      {/* user and organization protected */}
      <Route element={<ProtectedRoute allowedRoles={["user", "organization"]} />}>
        {/* Priority pages */}
        <Route path="/priority/urgent" element={<DashboardWrapper><PriorityPage priority={Priority.Urgent} /></DashboardWrapper>} />
        <Route path="/priority/high" element={<DashboardWrapper><PriorityPage priority={Priority.High} /></DashboardWrapper>} />
        <Route path="/priority/medium" element={<DashboardWrapper><PriorityPage priority={Priority.Medium} /></DashboardWrapper>} />
        <Route path="/priority/low" element={<DashboardWrapper><PriorityPage priority={ Priority.Low} /></DashboardWrapper>} />
        <Route path="/priority/backlog" element={<DashboardWrapper><PriorityPage priority={Priority.Backlog } /></DashboardWrapper>} />
        
        <Route path="/projects/:id" element={<DashboardWrapper><ProjectViewPage /></DashboardWrapper>} />
        <Route path="/org/projects/" element={<DashboardWrapper><ProjectListPage /></DashboardWrapper>} />
        <Route path="/meetings/" element={<DashboardWrapper><MeetingPage /></DashboardWrapper>} />

        

      </Route>

      <Route element={<ProtectedRoute allowedRoles={["organization"]} />}>
        <Route path="/org/dashboard" element={<DashboardWrapper><OrgDashboard /></DashboardWrapper>} />
        <Route path="/org/members" element={<DashboardWrapper><MembersPage /></DashboardWrapper>} />
        <Route path="/org/settings" element={<DashboardWrapper><OrgSettingsPage /></DashboardWrapper>} />
        <Route path="/org/plans" element={user ? <PlansPage /> : <Navigate to="/" replace />} />
        <Route path="/org/meetings/" element={<DashboardWrapper><MeetingPage /></DashboardWrapper>} />
        <Route path="/org/chat/" element={<DashboardWrapper><ChatPage /></DashboardWrapper>} />
        
      </Route>


      <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
        <Route path="/admin/dashboard" element={<DashboardWrapper><AdminPanel /></DashboardWrapper>} />
        <Route path="/admin/organizations" element={<DashboardWrapper><OrganizationsListPage /></DashboardWrapper>} />
        <Route path="/admin/users" element={<DashboardWrapper><UsersListPage /></DashboardWrapper>} />
        <Route path="/admin/payments" element={<DashboardWrapper><PaymentListPage /></DashboardWrapper>} />
        <Route path="/admin/settings" element={<DashboardWrapper><UserSettingsPage /></DashboardWrapper>} />

        
      </Route>


     

      {/* Error */}
      <Route path='/unauthorized' element={<UnauthorizedPage/>}/>

      
      <Route path='*' element={<NotFoundPage/>}/>
    </Routes>
  );
};

export default AppRouter;
