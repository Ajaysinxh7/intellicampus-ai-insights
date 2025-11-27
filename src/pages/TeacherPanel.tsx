import React, { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";

interface Student {
  id: string;
  email: string;
  name: string;
}

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

const TeacherPanel: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext is not available");

  const { user } = auth;
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [marksData, setMarksData] = useState<MarksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    subject: "",
    totalClasses: "",
    attendedClasses: "",
  });

  // Marks form state
  const [marksForm, setMarksForm] = useState({
    subject: "",
    marksObtained: "",
    totalMarks: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentData(selectedStudent.id);
    } else {
      setAttendanceData([]);
      setMarksData([]);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async (userId: string) => {
    try {
      setLoading(true);
      const [attendanceRes, marksRes] = await Promise.all([
        api.get(`/attendance/${userId}`),
        api.get(`/marks/${userId}`),
      ]);

      setAttendanceData(attendanceRes.data);
      setMarksData(marksRes.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/attendance", {
        userId: selectedStudent.id,
        subject: attendanceForm.subject,
        totalClasses: parseInt(attendanceForm.totalClasses),
        attendedClasses: parseInt(attendanceForm.attendedClasses),
      });

      alert("Attendance saved successfully!");
      setAttendanceForm({ subject: "", totalClasses: "", attendedClasses: "" });
      
      // Refresh student data
      if (selectedStudent) {
        fetchStudentData(selectedStudent.id);
      }
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      alert(error.response?.data?.message || "Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarksSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/marks", {
        userId: selectedStudent.id,
        subject: marksForm.subject,
        marksObtained: parseFloat(marksForm.marksObtained),
        totalMarks: parseFloat(marksForm.totalMarks),
      });

      alert("Marks saved successfully!");
      setMarksForm({ subject: "", marksObtained: "", totalMarks: "" });
      
      // Refresh student data
      if (selectedStudent) {
        fetchStudentData(selectedStudent.id);
      }
    } catch (error: any) {
      console.error("Error saving marks:", error);
      alert(error.response?.data?.message || "Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>

        {/* Student Selection */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Select Student</h2>
          {loading && students.length === 0 ? (
            <p className="text-gray-300">Loading students...</p>
          ) : (
            <select
              value={selectedStudent?.id || ""}
              onChange={(e) => {
                const student = students.find((s) => s.id === e.target.value);
                setSelectedStudent(student || null);
              }}
              className="w-full md:w-1/2 p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Select a student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id} className="text-black">
                  {student.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedStudent && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Attendance Entry Form */}
              <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Add/Update Attendance
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  Student: <span className="text-primary">{selectedStudent.email}</span>
                </p>
                <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={attendanceForm.subject}
                    onChange={(e) =>
                      setAttendanceForm({ ...attendanceForm, subject: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Total Classes"
                    value={attendanceForm.totalClasses}
                    onChange={(e) =>
                      setAttendanceForm({ ...attendanceForm, totalClasses: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Attended Classes"
                    value={attendanceForm.attendedClasses}
                    onChange={(e) =>
                      setAttendanceForm({ ...attendanceForm, attendedClasses: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save Attendance"}
                  </button>
                </form>
              </div>

              {/* Marks Entry Form */}
              <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Add/Update Marks
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  Student: <span className="text-primary">{selectedStudent.email}</span>
                </p>
                <form onSubmit={handleMarksSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={marksForm.subject}
                    onChange={(e) =>
                      setMarksForm({ ...marksForm, subject: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Marks Obtained"
                    value={marksForm.marksObtained}
                    onChange={(e) =>
                      setMarksForm({ ...marksForm, marksObtained: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total Marks"
                    value={marksForm.totalMarks}
                    onChange={(e) =>
                      setMarksForm({ ...marksForm, totalMarks: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full p-3 rounded-xl bg-card/50 border border-border/40 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save Marks"}
                  </button>
                </form>
              </div>
            </div>

            {/* Student's Existing Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Table */}
              <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {selectedStudent.email}'s Attendance
                </h2>
                {loading ? (
                  <p className="text-gray-300">Loading...</p>
                ) : attendanceData.length === 0 ? (
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
                        {attendanceData.map((item) => (
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
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {selectedStudent.email}'s Marks
                </h2>
                {loading ? (
                  <p className="text-gray-300">Loading...</p>
                ) : marksData.length === 0 ? (
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
                        {marksData.map((item) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherPanel;
