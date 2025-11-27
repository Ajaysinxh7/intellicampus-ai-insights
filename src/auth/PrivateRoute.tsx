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

    const { user } = auth;

    return user ? children : <Navigate to="/login" replace />;
    };

    export default PrivateRoute;
