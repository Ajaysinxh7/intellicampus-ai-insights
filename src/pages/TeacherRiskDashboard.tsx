import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";

interface RiskProfile {
    userId: string;
    name: string;
    email: string;
    overallAttendancePct: number;
    averageMarksPct: number;
    riskScore: number;
    riskLevel: "low" | "medium" | "high";
    reasons: string[];
}

const TeacherRiskDashboard: React.FC = () => {
    const [students, setStudents] = useState<RiskProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
    const [search, setSearch] = useState("");
    const { user } = useContext(AuthContext)!;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/risk/students");
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch risk data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesFilter = filter === "all" || student.riskLevel === filter;
        const matchesSearch =
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getRiskBadge = (level: string) => {
        switch (level) {
            case "high":
                return <span className="bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold uppercase">High Risk</span>;
            case "medium":
                return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Medium Risk</span>;
            case "low":
                return <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Low Risk</span>;
            default:
                return null;
        }
    };

    if (!user || user.role === "student") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                Access Denied. Teachers only.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Early Warning System 🚨</h1>
                        <p className="text-gray-400">Identify and assist at-risk students before they fall behind.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">All Risk Levels</option>
                            <option value="high">High Risk Only</option>
                            <option value="medium">Medium Risk Only</option>
                            <option value="low">Low Risk Only</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="bg-gray-700/50 text-gray-100 uppercase text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-4">Student</th>
                                        <th className="p-4 text-center">Attendance</th>
                                        <th className="p-4 text-center">Avg Marks</th>
                                        <th className="p-4">Risk Level</th>
                                        <th className="p-4">Identify Reasons</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.userId} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`font-mono font-bold ${student.overallAttendancePct < 75 ? 'text-red-400' : 'text-green-400'}`}>
                                                        {student.overallAttendancePct}%
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`font-mono font-bold ${student.averageMarksPct < 50 ? 'text-red-400' : 'text-green-400'}`}>
                                                        {student.averageMarksPct}%
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {getRiskBadge(student.riskLevel)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        {student.reasons.length > 0 ? (
                                                            student.reasons.map((reason, idx) => (
                                                                <span key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                                                                    ⚠️ {reason}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-green-500/50">No warnings</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                                No students found matching filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherRiskDashboard;
