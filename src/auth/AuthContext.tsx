import React, {
    createContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import api from "../api/axios";

// ----------------------------
// ⭐ Type Definitions
// ----------------------------

// User object shape
export interface User {
    id: string;
    email: string;
    role: string | null;
    accessToken: string;
    name?: string;
    enrollmentNumber?: string;
    branch?: string;
    collegeName?: string;
}

// Context value shape
export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
}

// Provider props type
interface AuthProviderProps {
    children: ReactNode;
}

// ----------------------------
// ⭐ Create Context
// ----------------------------
export const AuthContext = createContext<AuthContextType | null>(null);

// ----------------------------
// ⭐ Provider Component
// ----------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // ----------------------------
    // ⭐ Login
    // ----------------------------
    const login = async (email: string, password: string): Promise<User> => {
        const res = await api.post("/login", { email, password });

        const { accessToken, user: userData } = res.data;

        // Save in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        const user: User = {
            ...userData,
            accessToken,
        };

        setUser(user);
        return user;
    };

    // ----------------------------
    // ⭐ Logout
    // ----------------------------
    const logout = (): void => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    };

    // ----------------------------
    // ⭐ Auto-load user on refresh
    // ----------------------------
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            const parsed = JSON.parse(savedUser);

            setUser({
                id: parsed.id,
                email: parsed.email,
                role: parsed.role,
                accessToken: token,
                name: parsed.name,
                enrollmentNumber: parsed.enrollmentNumber,
                branch: parsed.branch,
                collegeName: parsed.collegeName,
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
