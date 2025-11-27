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
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "bot"; message: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

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

      setAttendance(attendanceRes.data);
      setMarks(marksRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again.");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Attendance Table */}
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Attendance</h2>
            {attendance.length === 0 ? (
              <p className="text-gray-300">No attendance data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left p-3">Subject</th>
                      <th className="text-right p-3">Attended</th>
                      <th className="text-right p-3">Total</th>
                      <th className="text-right p-3">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-border/20 hover:bg-card/20 transition-colors"
                      >
                        <td className="p-3">{item.subject}</td>
                        <td className="text-right p-3">{item.attendedClasses}</td>
                        <td className="text-right p-3">{item.totalClasses}</td>
                        <td className="text-right p-3">
                          <span
                            className={`font-semibold ${
                              item.percentage >= 75
                                ? "text-green-400"
                                : item.percentage >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
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
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Marks</h2>
            {marks.length === 0 ? (
              <p className="text-gray-300">No marks data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left p-3">Subject</th>
                      <th className="text-right p-3">Marks</th>
                      <th className="text-right p-3">Total</th>
                      <th className="text-right p-3">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-border/20 hover:bg-card/20 transition-colors"
                      >
                        <td className="p-3">{item.subject}</td>
                        <td className="text-right p-3">{item.marksObtained}</td>
                        <td className="text-right p-3">{item.totalMarks}</td>
                        <td className="text-right p-3">
                          <span
                            className={`font-semibold ${
                              item.percentage >= 75
                                ? "text-green-400"
                                : item.percentage >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
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
        </div>

        {/* AI Chatbot Section */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            AI Assistant
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            Ask me about your attendance, marks, or any questions related to your academic performance!
          </p>

          {/* Chat History */}
          <div className="bg-card/50 rounded-xl p-4 mb-4 h-64 overflow-y-auto border border-border/20">
            {chatHistory.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <p>Start a conversation by asking a question!</p>
                <p className="text-sm mt-2">
                  Try: "How many classes do I need in DBMS to reach 75%?" or "What's my average marks?"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        chat.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/60 text-white border border-border/20"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{chat.message}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card/60 text-white border border-border/20 rounded-lg p-3">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything about your attendance or marks..."
              className="flex-1 p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={!chatMessage.trim() || chatLoading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {chatLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
