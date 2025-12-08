import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "./AuthContext";

interface RoleRouteProps {
    children: ReactNode;
    role: string; // expected user role
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, role }) => {
    const auth = useContext(AuthContext);

    // If context is missing, block access
    if (!auth) return <Navigate to="/login" replace />;

    const { user, loading } = auth;

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black text-slate-500">Loading...</div>;
    }

    // Not logged in → redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // Logged in but wrong role → redirect to unauthorized page
    if (user.role !== role) return <Navigate to="/unauthorized" replace />;

    return children;
};

export default RoleRoute;
