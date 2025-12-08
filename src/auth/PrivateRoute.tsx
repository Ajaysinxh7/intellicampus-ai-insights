import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "./AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const auth = useContext(AuthContext);

    // If AuthContext is null (should not happen), treat as not logged in
    if (!auth) return <Navigate to="/login" replace />;

    const { user, loading } = auth;

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black text-slate-500">Loading...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
