import SectionHeader from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, TrendingUp, MessageSquare, Send } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DemoDashboard = () => {
  const attendanceData = [
    { subject: "Mathematics", present: 42, absent: 8, percentage: 84 },
    { subject: "Physics", present: 38, absent: 12, percentage: 76 },
    { subject: "Chemistry", present: 35, absent: 15, percentage: 70 },
    { subject: "Computer Sci", present: 45, absent: 5, percentage: 90 },
  ];

  const marksData = [
    { subject: "Mathematics", mid1: 75, mid2: 82, final: 85 },
    { subject: "Physics", mid1: 68, mid2: 72, final: 78 },
    { subject: "Chemistry", mid1: 72, mid2: 75, final: 80 },
    { subject: "Computer Sci", mid1: 88, mid2: 90, final: 92 },
  ];

  const trendData = [
    { week: "W1", attendance: 75 },
    { week: "W2", attendance: 78 },
    { week: "W3", attendance: 76 },
    { week: "W4", attendance: 80 },
    { week: "W5", attendance: 82 },
    { week: "W6", attendance: 84 },
  ];

  const chatMessages = [
    { role: "user", message: "What's my attendance in Physics?" },
    { role: "assistant", message: "Your attendance in Physics is 76% (38 present out of 50 classes). You're above the 75% threshold. Keep it up! 📊" },
    { role: "user", message: "How many classes do I need to attend in Chemistry to reach 75%?" },
    { role: "assistant", message: "Currently your Chemistry attendance is 70% (35/50). To reach 75%, you need to attend the next 20 consecutive classes without any absences. 🎯" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Demo Dashboard"
          subtitle="Interactive preview of IntelliCampus student interface"
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Data Tables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Table */}
            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-gradient-primary p-2">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold">Attendance Overview</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-2 font-semibold">Subject</th>
                      <th className="text-center py-3 px-2 font-semibold">Present</th>
                      <th className="text-center py-3 px-2 font-semibold">Absent</th>
                      <th className="text-center py-3 px-2 font-semibold">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/20">
                        <td className="py-3 px-2">{row.subject}</td>
                        <td className="text-center py-3 px-2 text-green-400">{row.present}</td>
                        <td className="text-center py-3 px-2 text-red-400">{row.absent}</td>
                        <td className="text-center py-3 px-2">
                          <span className={`font-semibold ${row.percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                            {row.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Marks Table */}
            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-gradient-primary p-2">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold">Marks Summary</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-2 font-semibold">Subject</th>
                      <th className="text-center py-3 px-2 font-semibold">Mid-1</th>
                      <th className="text-center py-3 px-2 font-semibold">Mid-2</th>
                      <th className="text-center py-3 px-2 font-semibold">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/20">
                        <td className="py-3 px-2">{row.subject}</td>
                        <td className="text-center py-3 px-2">{row.mid1}/100</td>
                        <td className="text-center py-3 px-2">{row.mid2}/100</td>
                        <td className="text-center py-3 px-2 font-semibold text-primary">{row.final}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 border-border/40 backdrop-blur animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                    <XAxis dataKey="week" stroke="hsl(215 20% 65%)" />
                    <YAxis stroke="hsl(215 20% 65%)" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(220 20% 10%)', border: '1px solid hsl(220 15% 20%)' }} />
                    <Line type="monotone" dataKey="attendance" stroke="hsl(239 84% 67%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 border-border/40 backdrop-blur animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h3 className="text-lg font-semibold mb-4">Marks Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={marksData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                    <XAxis dataKey="subject" stroke="hsl(215 20% 65%)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="hsl(215 20% 65%)" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(220 20% 10%)', border: '1px solid hsl(220 15% 20%)' }} />
                    <Bar dataKey="final" fill="hsl(271 81% 67%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Right Column - Chat Widget */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur sticky top-24 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-gradient-primary p-2">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold">AI Chatbot</h2>
              </div>

              <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 text-foreground'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about your attendance or marks..." 
                  className="flex-1 bg-muted/50 border-border/40"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                This is a static demo. The actual app has live AI responses.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
