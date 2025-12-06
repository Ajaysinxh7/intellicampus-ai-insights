import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    CreditCard,
    BarChart2,
    BookOpen,
    LayoutDashboard,
    Menu,
    X,
    GraduationCap
} from "lucide-react";

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { path: "/student", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/student/attendance", label: "Attendance", icon: <BookOpen size={20} /> },
        { path: "/student/marks", label: "Marks", icon: <BarChart2 size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-gradient-hero text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
            {/* Sidebar */}
            <aside
                className={`bg-white/80 dark:bg-card/30 backdrop-blur-xl border-r border-slate-200 dark:border-border/40 transition-all duration-300 ease-in-out flex flex-col z-20 
          ${isSidebarOpen ? "w-64" : "w-20"} 
          fixed md:relative h-full
        `}
            >
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10 h-16">
                    <div className={`flex items-center gap-2 ${!isSidebarOpen && "justify-center w-full"}`}>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <GraduationCap size={20} />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg whitespace-nowrap text-slate-900 dark:text-white">Student Panel</span>
                        )}
                    </div>
                    {isSidebarOpen && (
                        <button onClick={toggleSidebar} className="md:hidden text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
                                        : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }
                  ${!isSidebarOpen && "justify-center px-2"}
                `}
                            >
                                <div className={`${!isSidebarOpen ? "w-6 h-6" : ""}`}>{item.icon}</div>
                                {isSidebarOpen && <span>{item.label}</span>}

                                {/* Tooltip for collapsed mode */}
                                {!isSidebarOpen && (
                                    <div className="absolute left-16 bg-slate-900 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 ml-2">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Collapse Button (Desktop) */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 hidden md:flex justify-end">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header for Sidebar Toggle */}
                <div className="md:hidden h-16 border-b border-slate-200 dark:border-border/40 flex items-center px-4 bg-white/80 dark:bg-card/10 backdrop-blur-md">
                    <button onClick={toggleSidebar} className="text-slate-900 dark:text-white p-1">
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-semibold text-lg text-slate-900 dark:text-white">Menu</span>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
