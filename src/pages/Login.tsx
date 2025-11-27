    import { useState, useContext, FormEvent } from "react";
    import { useNavigate } from "react-router-dom";
    import { AuthContext } from "../auth/AuthContext";

    const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext is not available");

    const { login } = auth;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        const loggedInUser = await login(email, password);
        
        // Redirect based on role
        if (loggedInUser.role === "student") {
            navigate("/student");
        } else if (loggedInUser.role === "teacher") {
            navigate("/teacher");
        } else if (loggedInUser.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
        } catch (err) {
        alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Login
            </h1>

            <form onSubmit={submit} className="space-y-4">
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold"
            >
                Login
            </button>
            </form>
        </div>
        </div>
    );
    };

    export default Login;
