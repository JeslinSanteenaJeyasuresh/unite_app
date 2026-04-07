import { Navigate, useLocation } from "react-router-dom";
import { useApp, Role } from "@/context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  anyRole?: boolean; // if true, any logged-in user can access
}

export default function ProtectedRoute({ children, requiredRole, anyRole }: ProtectedRouteProps) {
  const { role } = useApp();
  const location = useLocation();

  if (anyRole) {
    if (!role) {
      return <Navigate to="/citizen-login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  if (role !== requiredRole) {
    const loginPath = requiredRole === "admin" ? "/admin-login" : "/citizen-login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
