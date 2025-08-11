import React, { useEffect } from "react";


import { useAppSelector } from "../../store/hooks";
import Navbar from "../ui/navbar";
import Sidebar from "../ui/sidebar";
import { useAuth } from "../../features/auth/useAuth";
import { useProject } from "../../features/project/useProject";




const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

   const { user } = useAuth();
  const { getAllProjects } = useProject();

  useEffect(() => {
    if (user?.role === "user") {
      getAllProjects({ orgId: user.orgId });
    }else
    if (user?.role === "organization") {
      getAllProjects({ orgId: user.id });
    }
  }, [user]);

  return (
    <div className="flex h-screen  w-full bg-gray-50 text-gray-900">
      <Sidebar/>
      <main
        className={`flex w-full flex-1  flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        <div className=" flex flex-1 flex-col  overflow-auto">
          {children}
          </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (

        <DashboardLayout>{children}</DashboardLayout>

  );
};

export default DashboardWrapper;