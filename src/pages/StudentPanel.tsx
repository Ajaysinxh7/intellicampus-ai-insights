import React, { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";


interface AttendanceData {
  _id: string;
  subject: string;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
}

interface MarksData {
  _id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

const StudentPanel: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext is not available");

  const { user } = auth;
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [marks, setMarks] = useState<MarksData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "bot"; message: string }>
  >([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Derived state for profile stats
  const [stats, setStats] = useState({
    avgAttendance: 0,
    avgMarks: 0,
    totalSubjects: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [attendanceRes, marksRes] = await Promise.all([
        api.get(`/attendance/${user.id}`),
        api.get(`/marks/${user.id}`),
      ]);

      const attendanceData: AttendanceData[] = attendanceRes.data;
      const marksData: MarksData[] = marksRes.data;

      setAttendance(attendanceData);
      setMarks(marksData);

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
      // alert("Failed to load data. Please try again."); // Removed alert for better UX
    } finally {
      setLoading(false);
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

  // Helper to get initials
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Helper to get name from email
  const getName = (email: string) => {
    return email.split("@")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome & Title */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome back, <span className="text-white font-semibold">{user?.email ? getName(user.email) : "Student"}</span>!
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6 flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.email ? getInitials(user.email) : "ST"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white capitalize">
                {user?.email ? getName(user.email) : "Student Name"}
              </h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/20 capitalize">
                {user?.role || "Student"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-card/50 transition-colors group">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Subjects</h3>
            <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">{stats.totalSubjects}</p>
          </div>
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-card/50 transition-colors group">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Avg. Attendance</h3>
            <p className={`text-3xl font-bold group-hover:scale-110 transition-transform ${stats.avgAttendance >= 75 ? "text-green-400" : stats.avgAttendance >= 60 ? "text-yellow-400" : "text-red-400"
              }`}>
              {stats.avgAttendance}%
            </p>
          </div>
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-card/50 transition-colors group">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Avg. Marks</h3>
            <p className={`text-3xl font-bold group-hover:scale-110 transition-transform ${stats.avgMarks >= 75 ? "text-green-400" : stats.avgMarks >= 60 ? "text-yellow-400" : "text-red-400"
              }`}>
              {stats.avgMarks}%
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Attendance Table */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-primary">📅</span> Attendance
              </h2>
            </div>

            {attendance.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 italic py-8">
                No attendance records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-border/40 text-sm text-gray-400">
                      <th className="text-left p-3 font-medium">Subject</th>
                      <th className="text-center p-3 font-medium">Attended</th>
                      <th className="text-center p-3 font-medium">Total</th>
                      <th className="text-right p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {attendance.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-border/10 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-3 font-medium">{item.subject}</td>
                        <td className="text-center p-3 text-gray-300">{item.attendedClasses}</td>
                        <td className="text-center p-3 text-gray-300">{item.totalClasses}</td>
                        <td className="text-right p-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-bold ${item.percentage >= 75
                              ? "bg-green-500/20 text-green-400 border border-green-500/20"
                              : item.percentage >= 60
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                                : "bg-red-500/20 text-red-400 border border-red-500/20"
                              }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Marks Table */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-primary">📊</span> Marks
              </h2>
            </div>

            {marks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 italic py-8">
                No marks records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-border/40 text-sm text-gray-400">
                      <th className="text-left p-3 font-medium">Subject</th>
                      <th className="text-center p-3 font-medium">Obtained</th>
                      <th className="text-center p-3 font-medium">Total</th>
                      <th className="text-right p-3 font-medium">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {marks.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-border/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 font-medium">{item.subject}</td>
                        <td className="text-center p-3 text-gray-300">{item.marksObtained}</td>
                        <td className="text-center p-3 text-gray-300">{item.totalMarks}</td>
                        <td className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.percentage >= 75 ? "bg-green-500" : item.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${item.percentage >= 75 ? "text-green-400" : item.percentage >= 60 ? "text-yellow-400" : "text-red-400"
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



        {/* AI Chatbot Section */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              🤖
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">AI Assistant</h2>
              <p className="text-gray-400 text-sm">Ask about your performance or academic queries</p>
            </div>
          </div>

          {/* Chat History */}
          <div className="bg-black/20 rounded-xl p-4 mb-4 h-64 overflow-y-auto border border-border/10 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
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
                        : "bg-card/80 text-white border border-border/20 rounded-tl-none"
                        }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{chat.message}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card/80 text-white border border-border/20 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
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
              className="w-full pl-4 pr-32 py-4 rounded-xl bg-black/20 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500 transition-all"
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
      </div>
    </div>
  );
};

export default StudentPanel;
