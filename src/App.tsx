import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import SystemArchitecture from "./pages/SystemArchitecture";
import APIDocs from "./pages/APIDocs";
import MLDesign from "./pages/MLDesign";
import DemoDashboard from "./pages/DemoDashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ⭐ ADDED (AUTH SYSTEM IMPORTS)
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import RoleRoute from "./auth/RoleRoute";

import Login from "./pages/Login";
import StudentPanel from "./pages/StudentPanel";
import TeacherPanel from "./pages/TeacherPanel";
import TeacherRiskDashboard from "./pages/TeacherRiskDashboard";
import AdminPanel from "./pages/AdminPanel";

import { useEffect } from "react";

const GlobalReloadWarning = () => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to trigger the dialog
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "You will be logged out if you reload. Are you sure?";
      return "You will be logged out if you reload. Are you sure?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
};

const App = () => (
  // ⭐ ADDED AuthProvider (wraps whole app)
  <AuthProvider>
    <GlobalReloadWarning />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>

                {/* ---------------------------- */}
                {/* ⭐ YOUR ORIGINAL ROUTES BELOW */}
                {/* ---------------------------- */}
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/architecture" element={<SystemArchitecture />} />
                <Route path="/api" element={<APIDocs />} />
                <Route path="/ml-design" element={<MLDesign />} />
                <Route path="/demo" element={<DemoDashboard />} />
                <Route path="/contact" element={<Contact />} />

                {/* ⭐ YOUR LOGIN PAGE */}
                <Route path="/login" element={<Login />} />

                {/* ⭐ ADDED – STUDENT ROUTE */}
                <Route
                  path="/student"
                  element={
                    <PrivateRoute>
                      <RoleRoute role="student">
                        <StudentPanel />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />



                {/* ⭐ ADDED – TEACHER ROUTE */}
                <Route
                  path="/teacher"
                  element={
                    <PrivateRoute>
                      <RoleRoute role="teacher">
                        <TeacherPanel />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teacher/risk"
                  element={
                    <PrivateRoute>
                      <RoleRoute role="teacher">
                        <TeacherRiskDashboard />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* ⭐ ADDED – ADMIN ROUTE */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <RoleRoute role="admin">
                        <AdminPanel />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* ⭐ 404 PAGE */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
