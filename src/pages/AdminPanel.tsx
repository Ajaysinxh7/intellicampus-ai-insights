import React, { useState, useEffect } from "react";
import api from "../api/axios";

interface ProfileRequest {
    _id: string;
    userId: {
        _id: string;
        email: string;
        name?: string;
        role: string;
    };
    requestedChanges: {
        enrollmentNumber?: string;
        branch?: string;
        collegeName?: string;
    };
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

const AdminPanel: React.FC = () => {
    const [requests, setRequests] = useState<ProfileRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/requests");
            setRequests(res.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setActionLoading(id);
        try {
            await api.put(`/admin/requests/${id}`, { action });
            // Remove from list or update status
            setRequests((prev) => prev.filter((req) => req._id !== id));
            // alert(`Request ${action}ed successfully`);
        } catch (error) {
            console.error(`Failed to ${action} request`, error);
            alert(`Failed to ${action} request`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-white">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">Manage student profile change requests</p>
                    </div>
                    <button
                        onClick={fetchRequests}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="grid gap-6">
                    {requests.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-gray-400 text-lg">No pending requests</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div
                                key={req._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-all"
                            >
                                {/* User Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                                            {req.userId.email.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {req.userId.name || req.userId.email.split("@")[0]}
                                            </h3>
                                            <p className="text-sm text-gray-400">{req.userId.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 pt-2">
                                        Requested on: {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden md:block w-px bg-white/10" />

                                {/* Changes Requested */}
                                <div className="flex-[2] space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Requested Changes
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {req.requestedChanges.enrollmentNumber && (
                                            <div className="bg-black/20 p-3 rounded-lg">
                                                <span className="text-xs text-gray-500 block">Enrollment No.</span>
                                                <span className="text-green-400 font-mono">{req.requestedChanges.enrollmentNumber}</span>
                                            </div>
                                        )}
                                        {req.requestedChanges.branch && (
                                            <div className="bg-black/20 p-3 rounded-lg">
                                                <span className="text-xs text-gray-500 block">Branch</span>
                                                <span className="text-green-400">{req.requestedChanges.branch}</span>
                                            </div>
                                        )}
                                        {req.requestedChanges.collegeName && (
                                            <div className="bg-black/20 p-3 rounded-lg">
                                                <span className="text-xs text-gray-500 block">College</span>
                                                <span className="text-green-400">{req.requestedChanges.collegeName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col justify-center gap-3 md:w-32">
                                    <button
                                        onClick={() => handleAction(req._id, "approve")}
                                        disabled={actionLoading === req._id}
                                        className="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg font-medium transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === req._id ? "..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, "reject")}
                                        disabled={actionLoading === req._id}
                                        className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === req._id ? "..." : "Reject"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
