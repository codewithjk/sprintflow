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
import { SettingsPage } from '../features/organization/pages/settingsPage';
import { HomePage } from '../pages/home';
import { MeetingPage } from '../features/meetings/pages/MeetingPage';

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

     

   

      {/* user  protected */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        {/* add here protected routes */}
        <Route path='/home' element={ <DashboardWrapper><HomePage/></DashboardWrapper> }/>
      </Route>


      {/* user and organization protected */}
      <Route element={<ProtectedRoute allowedRoles={["user", "organization"]} />}>
        {/* Priority pages */}
        <Route path="/priority/urgent" element={<DashboardWrapper><PriorityPage priority={Priority.Urgent} /></DashboardWrapper>} />
        <Route path="/priority/high" element={<DashboardWrapper><PriorityPage priority={Priority.High} /></DashboardWrapper>} />
        <Route path="/priority/medium" element={<DashboardWrapper><PriorityPage priority={Priority.Medium} /></DashboardWrapper>} />
        <Route path="/priority/low" element={<DashboardWrapper><PriorityPage priority={ Priority.Low} /></DashboardWrapper>} />
        <Route path="/priority/backlog" element={<DashboardWrapper><PriorityPage priority={Priority.Backlog } /></DashboardWrapper>} />
        
        {/* Project */}
        <Route path="/projects/:id" element={<DashboardWrapper><ProjectViewPage /></DashboardWrapper>} />
        <Route path="/org/projects/" element={<DashboardWrapper><ProjectListPage /></DashboardWrapper>} />
        
        {/* Meeting */}
        <Route path="/meetings/" element={<DashboardWrapper><MeetingPage /></DashboardWrapper>} />

      </Route>

      <Route element={<ProtectedRoute allowedRoles={["organization"]} />}>
        <Route path="/org/dashboard" element={<DashboardWrapper><OrgDashboard /></DashboardWrapper>} />
        <Route path="/org/members" element={<DashboardWrapper><MembersPage /></DashboardWrapper>} />
        <Route path="/org/settings" element={<DashboardWrapper><SettingsPage /></DashboardWrapper>} />
        <Route path="/org/plans" element={user ? <PlansPage /> : <Navigate to="/" replace />} />
        <Route path="/org/meetings/" element={<DashboardWrapper><MeetingPage /></DashboardWrapper>} />
        
      </Route>


     

      {/* Error */}
      <Route path='/unauthorized' element={<UnauthorizedPage/>}/>

      
      <Route path='/*' element={<div className='text-red-600'> 404 </div>}/>
    </Routes>
  );
};

export default AppRouter;
