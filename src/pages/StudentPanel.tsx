import React, { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* Header & Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome & Title */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg">
            Welcome back, <span className="text-slate-900 dark:text-white font-semibold">{user?.name || (user?.email ? getName(user.email) : "Student")}</span>!
          </p>
        </div>

        {/* Profile Card Trigger */}
        <div
          onClick={() => {
            setIsProfileOpen(true);
            // Sync request data for editing
            if (!isRequestMode) {
              setRequestData({
                enrollmentNumber: profileData.enrollmentNumber,
                branch: profileData.branch,
                collegeName: profileData.collegeName
              });
            }
          }}
          className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl shadow-xl p-6 flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer group"
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-primary/50 transition-all">
            {user?.email ? getInitials(user.email) : "ST"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize group-hover:text-primary transition-colors">
              {profileData.name || (user?.email ? getName(user.email) : "Student Name")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 capitalize">
              {user?.role || "Student"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/80 dark:hover:bg-card/50 transition-colors group">
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Total Subjects</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{stats.totalSubjects}</p>
        </div>
        <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/80 dark:hover:bg-card/50 transition-colors group">
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Avg. Attendance</h3>
          <p className={`text-3xl font-bold group-hover:scale-110 transition-transform ${stats.avgAttendance >= 75 ? "text-green-600 dark:text-green-400" : stats.avgAttendance >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
            }`}>
            {stats.avgAttendance}%
          </p>
        </div>
        <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/80 dark:hover:bg-card/50 transition-colors group">
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Avg. Marks</h3>
          <p className={`text-3xl font-bold group-hover:scale-110 transition-transform ${stats.avgMarks >= 75 ? "text-green-600 dark:text-green-400" : stats.avgMarks >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
            }`}>
            {stats.avgMarks}%
          </p>
        </div>
      </div>

      {/* AI Chatbot Section (Kept on Dashboard) */}
      <div className="bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-border/40 rounded-2xl shadow-xl p-6 h-[500px] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Assistant</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Ask about your performance or academic queries</p>
          </div>
        </div>

        {/* Chat History */}
        <div className="bg-slate-100 dark:bg-black/20 rounded-xl p-4 mb-4 flex-1 overflow-y-auto border border-slate-200 dark:border-border/10 custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-gray-500 space-y-2">
              <p>👋 Hi {user?.email ? getName(user.email) : "there"}!</p>
              <p className="text-sm text-center max-w-md">
                I can help you analyze your grades, predict attendance needs, or answer subject questions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${chat.type === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white dark:bg-card/80 text-slate-800 dark:text-white border border-slate-200 dark:border-border/20 rounded-tl-none"
                      }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{chat.message}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-card/80 text-slate-800 dark:text-white border border-slate-200 dark:border-border/20 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="relative">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-4 pr-32 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-border/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition-all"
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={!chatMessage.trim() || chatLoading}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {chatLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>

      {/* Profile Modal (Reused) */}
      {isProfileOpen && (
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
      )}

    </div>
  );
};

export default StudentPanel;
