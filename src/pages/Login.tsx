
import { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from "lucide-react";

const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext is not available");

    const { login } = auth;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const loggedInUser = await login(email, password);

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
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden bg-white dark:bg-black selection:bg-primary/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 dark:invert"></div>
            </div>

            {/* Floating Glass Card */}
            <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
                <Card className="border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-white/60">
                            Enter your credentials to access the portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-white/80">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-white/40 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="name@school.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 h-11 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 transition-all font-light"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700 dark:text-white/80">Password</Label>
                                    <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-white/40 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-10 h-11 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 transition-all font-light"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-11 w-11 px-0 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-white/10" />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-slate-500 dark:text-white/40 pb-8">
                        Don't have an account? <a href="#" className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors">Request Access</a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
