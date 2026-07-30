import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleProtectedRoute = ({ role, children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (profile?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;