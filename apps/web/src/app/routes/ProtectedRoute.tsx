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
  const { role, isOrganization, isUser } = useRole();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const sync = async () => {
      setIsRefreshing(true)
      try {
        if (user && user.role === "organization" || user?.role === "user") {
          await refreshAuth({
            id: user.id,
            role: user.role as "user" | "super_admin" | "organization",
          });
        }
      } finally {
        setIsRefreshing(false);
      }
    };
    sync();
  }, []);

  if (isLoading || isRefreshing) {
    return <div className="text:white">...Loading</div>;
  }

  // Plan-based access control handled during render
  if (isOrganization && user?.plan === "free" && pathname !== "/org/plans") {
    return (
      <Navigate to="/org/plans" state={{ from: pathname }} replace />
    );
  }

  if (isOrganization && user?.plan !== "free" && pathname === "/org/plans") {
    return <Navigate to="/org/dashboard" replace />;
  }

  //handle blocked users
  if (isUser && user?.status === "blocked" && pathname !== "/blocked") {
    return (
      <Navigate to="/blocked" state={{ from: pathname }} replace />
    );
  }
  if (isUser && user?.status !== "blocked" && pathname === "/blocked") {
    return <Navigate to="/home" replace />;
  }




  // Role-based route protection
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  return user ? (
    <Navigate to="/unauthorized" state={{ from: pathname }} replace />
  ) : (
    <Navigate to="/" state={{ from: pathname }} replace />
  );
};
