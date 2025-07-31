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

  useEffect(() => {
    const sync = async () => {
      try {
        if (user && user.role === "organization") {
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

  // ✅ Plan-based access control handled during render
  if (isOrganization && user?.plan === "free" && pathname !== "/org/plans") {
    return (
      <Navigate to="/org/plans" state={{ from: pathname }} replace />
    );
  }

  if (isOrganization && user?.plan !== "free" && pathname === "/org/plans") {
    return <Navigate to="/org/dashboard" replace />;
  }

  // ✅ Role-based route protection
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  return user ? (
    <Navigate to="/unauthorized" state={{ from: pathname }} replace />
  ) : (
    <Navigate to="/login" state={{ from: pathname }} replace />
  );
};
