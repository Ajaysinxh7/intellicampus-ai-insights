import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { AlertCircle, CheckCircle, TrendingUp, BookOpen } from "lucide-react";

interface AttendanceData {
    _id: string;
    subject: string;
    attendedClasses: number;
    totalClasses: number;
    percentage: number;
}

const AttendancePage: React.FC = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext is not available");

    const { user } = auth;
    const [attendance, setAttendance] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const res = await api.get(`/attendance/${user.id}`);
                setAttendance(res.data);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // --- Analytics & Helpers ---
    const totalClasses = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalAttended = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
    const lowAttendanceCount = attendance.filter(a => a.percentage < 75).length;

    const getPrediction = (attended: number, total: number) => {
        const currentPct = (attended / total) * 100;
        if (currentPct < 75) {
            // How many MORE to attend to hit 75%?
            const needed = 3 * total - 4 * attended;
            return {
                text: `Attend ${Math.ceil(needed)} more classes`,
                type: 'danger',
                count: Math.ceil(needed)
            };
        } else {
            // How many can I miss and stay above 75%?
            const margin = Math.floor((4 * attended - 3 * total) / 3);
            return {
                text: `Safe to miss ${margin} classes`,
                type: 'success',
                count: margin
            };
        }
    };

    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];
    const getBarColor = (pct: number) => {
        if (pct >= 75) return COLORS[0];
        if (pct >= 60) return COLORS[1];
        return COLORS[2];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance Insights</h1>
                <p className="text-slate-500 dark:text-gray-400">Track your performance and plan your leaves intelligently.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Overall Attendance</p>
                        <h2 className={`text-3xl font-bold mt-1 ${overallPercentage >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {overallPercentage}%
                        </h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Total Classes</p>
                        <h2 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{totalClasses}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BookOpen size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Classes Attended</p>
                        <h2 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{totalAttended}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">At Risk Subjects</p>
                        <h2 className={`text-3xl font-bold mt-1 ${lowAttendanceCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-200 dark:text-gray-200"}`}>
                            {lowAttendanceCount}
                        </h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Bar Chart */}
                <div className="lg:col-span-2 bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Subject Breakdown</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendance} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="subject"
                                    stroke="#9CA3AF"
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                    tickFormatter={(val) => val.substring(0, 3).toUpperCase()}
                                />
                                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                                />
                                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                    {attendance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Circular Stat (Mental Helper) */}
                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-6 rounded-2xl flex flex-col items-center justify-center relative">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 w-full text-left">Overall Health</h3>
                    <div className="h-[250px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Attended', value: totalAttended },
                                        { name: 'Missed', value: totalClasses - totalAttended }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{overallPercentage}%</span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">Attendance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed List */}
            <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-border/20">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detailed Status</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-slate-900 dark:text-white">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 text-sm text-slate-500 dark:text-gray-400">
                                <th className="text-left p-4 font-medium">Subject</th>
                                <th className="text-center p-4 font-medium">Attended / Total</th>
                                <th className="text-center p-4 font-medium">Percentage</th>
                                <th className="text-right p-4 font-medium">Prediction</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-200 dark:divide-border/10">
                            {attendance.map((item) => {
                                const prediction = getPrediction(item.attendedClasses, item.totalClasses);
                                return (
                                    <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {item.subject.substring(0, 2).toUpperCase()}
                                                </div>
                                                {item.subject}
                                            </div>
                                        </td>
                                        <td className="text-center p-4 text-slate-600 dark:text-gray-300">
                                            {item.attendedClasses} <span className="text-slate-400 dark:text-gray-600">/</span> {item.totalClasses}
                                        </td>
                                        <td className="text-center p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${item.percentage >= 75
                                                    ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                                    : item.percentage >= 60
                                                        ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                                                        : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                                                    }`}
                                            >
                                                {item.percentage}%
                                            </span>
                                        </td>
                                        <td className="text-right p-4">
                                            <span
                                                className={`text-xs font-medium ${prediction.type === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                                    }`}
                                            >
                                                {prediction.text}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {attendance.length === 0 && (
                    <div className="text-center text-slate-500 dark:text-gray-400 py-12 italic">
                        No attendance records found for this semester.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendancePage;
