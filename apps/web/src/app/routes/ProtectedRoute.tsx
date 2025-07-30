// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useRole } from "../hooks/useRole";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const { user, refreshAuth, isLoading } = useAuth();
  const { role, isOrganization } = useRole();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  //sync org with backend in every refresh. for plan update
  useEffect(() => {
    const sync = async () => {
      if (user) {
        await refreshAuth({
          id: user.id,
          role: user.role as "user" | "super_admin" | "organization",
        });
      }
      setIsRefreshing(false);
    };
    sync();
  }, []);

  if (isLoading || isRefreshing) {
    return <div className="text:white">...Loading</div>;
  }

  console.log(isOrganization, user?.plan, pathname);
  //check payment
  if (isOrganization && user?.plan === "free") {
    return (
      <Navigate to="/org/plans" state={{ from: location.pathname }} replace />
    );
  } else if (pathname === "/org/plans") {
    console.log("dfasdfasd");
    return <Navigate to="/org/dashboard" replace />;
  }

  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};
