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
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from "recharts";
import { Award, TrendingUp, BookOpen, AlertCircle } from "lucide-react";

interface MarksData {
    _id: string;
    subject: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
}

const MarksPage: React.FC = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext is not available");

    const { user } = auth;
    const [marks, setMarks] = useState<MarksData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const res = await api.get(`/marks/${user.id}`);
                setMarks(res.data);
            } catch (error) {
                console.error("Error fetching marks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // --- Analytics ---
    const totalObtained = marks.reduce((acc, curr) => acc + curr.marksObtained, 0);
    const totalPossible = marks.reduce((acc, curr) => acc + curr.totalMarks, 0);
    const overallPercentage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

    const bestSubject = marks.reduce((prev, current) =>
        (prev.percentage > current.percentage) ? prev : current
        , marks[0] || { subject: "N/A", percentage: 0 });

    const atRiskCount = marks.filter(m => m.percentage < 60).length;

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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Academic Performance</h1>
                <p className="text-slate-500 dark:text-gray-400">Comprehensive view of your grades and subject mastery.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Overall Grade</p>
                        <h2 className={`text-3xl font-bold mt-1 ${overallPercentage >= 75 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                            {overallPercentage}%
                        </h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Best Subject</p>
                        <h2 className="text-xl font-bold mt-1 text-slate-900 dark:text-white truncate max-w-[120px]" title={bestSubject.subject}>
                            {bestSubject.subject}
                        </h2>
                        <div className="text-xs text-green-600 dark:text-green-400 font-mono mt-1">{bestSubject.percentage}%</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <Award size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Total Marks</p>
                        <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                            {totalObtained} <span className="text-slate-400 dark:text-gray-500 text-lg font-normal">/ {totalPossible}</span>
                        </h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BookOpen size={24} />
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Needs Attention</p>
                        <h2 className={`text-3xl font-bold mt-1 ${atRiskCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-200 dark:text-gray-200"}`}>
                            {atRiskCount}
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-gray-500">Subjects below 60%</span>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Marks Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marks} barSize={30}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="subject"
                                    stroke="#9CA3AF"
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                    tickFormatter={(val) => val.substring(0, 3).toUpperCase()}
                                />
                                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                                />
                                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                    {marks.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Chart (Skills Analysis) */}
                <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 p-6 rounded-2xl flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 w-full text-left">Skill Radar</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={marks}>
                                <PolarGrid stroke="#888888" strokeOpacity={0.2} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Percentage"
                                    dataKey="percentage"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.4}
                                />
                                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-500 mt-2 text-center">Relative performance across subjects</p>
                </div>
            </div>

            {/* Detailed List */}
            <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-border/20">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scoresheet</h3>
                </div>
                {marks.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-gray-400 py-12 italic">
                        No marks records found for this semester.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-slate-900 dark:text-white">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 text-sm text-slate-500 dark:text-gray-400">
                                    <th className="text-left p-4 font-medium">Subject</th>
                                    <th className="text-center p-4 font-medium">Obtained</th>
                                    <th className="text-center p-4 font-medium">Total Marks</th>
                                    <th className="text-right p-4 font-medium">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-200 dark:divide-border/10">
                                {marks.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {item.subject.substring(0, 2).toUpperCase()}
                                            </div>
                                            {item.subject}
                                        </td>
                                        <td className="text-center p-4 text-slate-600 dark:text-gray-300 font-mono">{item.marksObtained}</td>
                                        <td className="text-center p-4 text-slate-600 dark:text-gray-300 font-mono">{item.totalMarks}</td>
                                        <td className="text-right p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="hidden sm:block w-24 h-1.5 bg-slate-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${item.percentage >= 75 ? "bg-green-500" : item.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                                                            }`}
                                                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-200 dark:bg-black/20 ${item.percentage >= 75 ? "text-green-700 dark:text-green-400" : item.percentage >= 60 ? "text-yellow-700 dark:text-yellow-400" : "text-red-700 dark:text-red-400"
                                                    }`}>
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarksPage;
