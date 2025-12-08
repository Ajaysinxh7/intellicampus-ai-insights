import React, { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


// Interfaces (Reduced for this summary view)
interface SimpleStat {
  _id: string;
  percentage: number;
}

const StudentPanel: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext is not available");

  const { user } = auth;
  const [loading, setLoading] = useState(true);

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "bot"; message: string }>
  >([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    avgAttendance: 0,
    avgMarks: 0,
    totalSubjects: 0,
  });

  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [marksList, setMarksList] = useState<any[]>([]);


  // Profile Request State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRequestMode, setIsRequestMode] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    name: "",
    enrollmentNumber: "",
    branch: "",
    collegeName: "",
  });
  const [requestData, setRequestData] = useState({
    enrollmentNumber: "",
    branch: "",
    collegeName: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && !profileData.name) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || getName(user.email),
      }));
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [attendanceRes, marksRes, profileRes] = await Promise.all([
        api.get(`/attendance/${user.id}`),
        api.get(`/marks/${user.id}`),
        api.get("/users/profile"),
      ]);

      const attendanceData: any[] = attendanceRes.data;
      const marksData: any[] = marksRes.data;

      setAttendanceList(attendanceData);
      setMarksList(marksData);

      const profileInfo: any = profileRes.data;


      // Check request status
      try {
        const statusRes = await api.get("/users/profile-request/status");
        setHasPendingRequest(statusRes.data.hasPendingRequest);
        if (statusRes.data.request) {
          setRequestStatus(statusRes.data.request);
        }
      } catch (e) {
        console.log("Could not fetch request status", e);
      }

      setProfileData({
        name: profileInfo.name || getName(profileInfo.email || user.email),
        enrollmentNumber: profileInfo.enrollmentNumber || profileInfo["enrollment no"] || "",
        branch: profileInfo.branch || profileInfo.Branch || "",
        collegeName: profileInfo.collegeName || profileInfo.CollegeName || "",
      });

      // Calculate stats
      const totalSubjects = Math.max(
        attendanceData.length,
        marksData.length
      );

      const avgAttendance =
        attendanceData.length > 0
          ? attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) /
          attendanceData.length
          : 0;

      const avgMarks =
        marksData.length > 0
          ? marksData.reduce((acc, curr) => acc + curr.percentage, 0) /
          marksData.length
          : 0;

      setStats({
        totalSubjects,
        avgAttendance: Math.round(avgAttendance),
        avgMarks: Math.round(avgMarks),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    setSaveLoading(true);
    try {
      await api.post("/users/profile-request", requestData);
      setHasPendingRequest(true);
      setIsRequestMode(false);
    } catch (error: any) {
      console.error("Failed to submit profile request", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatMessage.trim() || !user?.id || chatLoading) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { type: "user", message: userMessage }]);
    setChatLoading(true);

    try {
      const response = await api.post("/chatbot", {
        userId: user.id,
        message: userMessage,
      });

      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: response.data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          message: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const getName = (email: string) => {
    return email.split("@")[0];
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col pb-2 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

        {/* Left Column: Header, Profile, Stats, Charts */}
        <div className="lg:col-span-2 flex flex-col gap-2 h-full overflow-hidden">

          {/* Top Section: Headers & Stats */}
          <div className="flex-none space-y-2">
            {/* Header & Profile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2 flex flex-col justify-center">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5 bg-gradient-primary bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-[10px]">
                  Welcome back, <span className="text-slate-900 dark:text-white font-semibold">{user?.name || (user?.email ? getName(user.email) : "Student")}</span>!
                </p>
              </div>

              {/* Profile Card Trigger - Compact */}
              <div
                onClick={() => {
                  setIsProfileOpen(true);
                  if (!isRequestMode) {
                    setRequestData({
                      enrollmentNumber: profileData.enrollmentNumber,
                      branch: profileData.branch,
                      collegeName: profileData.collegeName
                    });
                  }
                }}
                className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl shadow-sm p-2 flex items-center gap-3 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {user?.email ? getInitials(user.email) : "ST"}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                    {profileData.name || (user?.email ? getName(user.email) : "Student")}
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase">{user?.role || "Student"}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats - Compact */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl p-2 flex flex-col items-center justify-center">
                <h3 className="text-slate-500 dark:text-gray-400 text-[10px] font-medium mb-0.5">Subjects</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalSubjects}</p>
              </div>
              <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl p-2 flex flex-col items-center justify-center">
                <h3 className="text-slate-500 dark:text-gray-400 text-[10px] font-medium mb-0.5">Attendance</h3>
                <p className={`text-lg font-bold ${stats.avgAttendance >= 75 ? "text-green-600 dark:text-green-400" : stats.avgAttendance >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                  {stats.avgAttendance}%
                </p>
              </div>
              <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl p-2 flex flex-col items-center justify-center">
                <h3 className="text-slate-500 dark:text-gray-400 text-[10px] font-medium mb-0.5">Marks</h3>
                <p className={`text-lg font-bold ${stats.avgMarks >= 75 ? "text-green-600 dark:text-green-400" : stats.avgMarks >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                  {stats.avgMarks}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section - Flexible Height */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl p-2 shadow-sm flex flex-col h-full">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2 flex-none">
                <span className="p-1 rounded bg-blue-500/10 text-blue-500">📊</span>
                Attendance Overview
              </h3>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceList} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical={false} />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} interval={0} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl p-2 shadow-sm flex flex-col h-full">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2 flex-none">
                <span className="p-1 rounded bg-purple-500/10 text-purple-500">📈</span>
                Marks Performance
              </h3>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marksList} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical={false} />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} interval={0} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Chatbot - Full Height */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-xl shadow-xl p-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3 flex-none">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-lg">
                🤖
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Assistant</h2>
                <p className="text-slate-500 dark:text-gray-400 text-xs">Academic queries</p>
              </div>
            </div>

            {/* Chat History - Scrollable */}
            <div className="bg-slate-100 dark:bg-black/20 rounded-xl p-3 mb-3 flex-1 overflow-y-auto border border-slate-200 dark:border-border/10 custom-scrollbar">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-gray-500 space-y-2">
                  <p className="text-sm">👋 Hi {user?.email ? getName(user.email) : "there"}!</p>
                  <p className="text-xs text-center max-w-[200px]">
                    I can help you with your grades and attendance.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[90%] rounded-xl p-2.5 shadow-sm text-sm ${chat.type === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white dark:bg-card/80 text-slate-800 dark:text-white border border-slate-200 dark:border-border/20 rounded-tl-none"
                        }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{chat.message}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-card/80 border rounded-xl rounded-tl-none p-3 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="relative flex-none">
              <input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-3 pr-20 py-2.5 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-border/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={!chatMessage.trim() || chatLoading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Profile Modal (Reused) */}
      {
        isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a1f3c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent rounded-t-2xl">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  👤 Student Profile
                </h2>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsRequestMode(false);
                  }}
                  className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-slate-100 dark:ring-black/20">
                    {user?.email ? getInitials(user.email) : "ST"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profileData.name || (user?.email ? getName(user.email) : "Student")}
                    </h3>
                    <p className="text-primary/80 font-medium">{user?.role || "Student"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        readOnly
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-400 dark:text-gray-300 cursor-not-allowed focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-gray-600 pl-1">* Name cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Enrollment No.</label>
                      <input
                        type="text"
                        value={isRequestMode ? requestData.enrollmentNumber : profileData.enrollmentNumber}
                        onChange={(e) => setRequestData({ ...requestData, enrollmentNumber: e.target.value })}
                        readOnly={!isRequestMode}
                        placeholder="Not set"
                        className={`w-full bg-slate-50 dark:bg-black/20 border ${isRequestMode ? "border-primary/50 focus:border-primary bg-slate-100 dark:bg-black/40" : "border-slate-200 dark:border-white/5 border-transparent"} rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Branch</label>
                    <input
                      type="text"
                      value={isRequestMode ? requestData.branch : profileData.branch}
                      onChange={(e) => setRequestData({ ...requestData, branch: e.target.value })}
                      readOnly={!isRequestMode}
                      placeholder="Not set"
                      className={`w-full bg-slate-50 dark:bg-black/20 border ${isRequestMode ? "border-primary/50 focus:border-primary bg-slate-100 dark:bg-black/40" : "border-slate-200 dark:border-white/5 border-transparent"} rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">College Name</label>
                    <input
                      type="text"
                      value={isRequestMode ? requestData.collegeName : profileData.collegeName}
                      onChange={(e) => setRequestData({ ...requestData, collegeName: e.target.value })}
                      readOnly={!isRequestMode}
                      placeholder="Not set"
                      className={`w-full bg-slate-50 dark:bg-black/20 border ${isRequestMode ? "border-primary/50 focus:border-primary bg-slate-100 dark:bg-black/40" : "border-slate-200 dark:border-white/5 border-transparent"} rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {!isRequestMode ? (
                    hasPendingRequest ? (
                      <div className="w-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-4 py-3 rounded-lg text-center font-medium">
                        Change Request Pending
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setIsRequestMode(true);
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 rounded-lg transition-all"
                      >
                        Request Change
                      </button>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => setIsRequestMode(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white font-medium py-3 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitRequest}
                        disabled={saveLoading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {saveLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default StudentPanel;
