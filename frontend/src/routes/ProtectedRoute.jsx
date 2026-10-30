import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes checking the user
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no authenticated user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;