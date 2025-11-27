import { Router, Request, Response } from "express";
import Attendance from "../models/Attendance";
import Marks from "../models/Marks";
import { verifyAccessToken } from "../middleware/auth";
import { classesNeeded } from "../utils/calcAttendance";

const router = Router();

router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    const authenticatedUserId = (req as any).user.userId;

    // Ensure user can only access their own data
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    // Fetch all attendance and marks for the user
    const attendanceData = await Attendance.find({ userId });
    const marksData = await Marks.find({ userId });

    const messageLower = message.toLowerCase();

    // Analyze message and generate response
    let reply = "";

    // Check for attendance-related queries
    if (messageLower.includes("attendance") || messageLower.includes("class")) {
      const subjectsBelow75 = attendanceData
        .map((item) => {
          const percentage =
            item.totalClasses > 0
              ? (item.attendedClasses / item.totalClasses) * 100
              : 0;
          return {
            subject: item.subject,
            percentage: Math.round(percentage * 100) / 100,
            attended: item.attendedClasses,
            total: item.totalClasses,
          };
        })
        .filter((item) => item.percentage < 75);

      if (subjectsBelow75.length > 0) {
        reply = "Subjects below 75% attendance:\n";
        subjectsBelow75.forEach((item) => {
          const needed = classesNeeded(item.attended, item.total, 75);
          reply += `• ${item.subject}: ${item.percentage}% (${item.attended}/${item.total} classes). `;
          if (needed > 0) {
            reply += `Attend ${needed} more class${needed > 1 ? "es" : ""} to reach 75%.\n`;
          } else {
            reply += "Already at or above 75%.\n";
          }
        });
      } else {
        reply = "Great! All your subjects have 75% or higher attendance.";
      }
    }
    // Check for specific subject query (e.g., "How many classes do I need in DBMS?")
    else if (
      messageLower.includes("need") ||
      messageLower.includes("how many") ||
      messageLower.includes("75")
    ) {
      // Try to extract subject name from message
      const subjects = attendanceData.map((a) => a.subject.toLowerCase());
      const mentionedSubject = subjects.find((subj) =>
        messageLower.includes(subj)
      );

      if (mentionedSubject) {
        const attendance = attendanceData.find(
          (a) => a.subject.toLowerCase() === mentionedSubject
        );
        if (attendance) {
          const percentage =
            attendance.totalClasses > 0
              ? (attendance.attendedClasses / attendance.totalClasses) * 100
              : 0;
          const needed = classesNeeded(
            attendance.attendedClasses,
            attendance.totalClasses,
            75
          );
          const subjectName = attendance.subject;
          reply = `You currently have ${Math.round(percentage * 100) / 100}% attendance in ${subjectName} (${attendance.attendedClasses}/${attendance.totalClasses} classes). `;
          if (needed > 0) {
            reply += `Attend ${needed} more class${needed > 1 ? "es" : ""} to reach 75%.`;
          } else {
            reply += "You've already reached 75% attendance!";
          }
        } else {
          reply = `No attendance data found for ${mentionedSubject}.`;
        }
      } else {
        // General query about classes needed
        const allSubjects = attendanceData.map((item) => {
          const percentage =
            item.totalClasses > 0
              ? (item.attendedClasses / item.totalClasses) * 100
              : 0;
          const needed = classesNeeded(
            item.attendedClasses,
            item.totalClasses,
            75
          );
          return {
            subject: item.subject,
            percentage: Math.round(percentage * 100) / 100,
            needed,
          };
        });

        reply = "Classes needed to reach 75% attendance:\n";
        allSubjects.forEach((item) => {
          if (item.needed > 0) {
            reply += `• ${item.subject}: ${item.needed} more class${item.needed > 1 ? "es" : ""} (currently ${item.percentage}%)\n`;
          } else {
            reply += `• ${item.subject}: Already at or above 75% (${item.percentage}%)\n`;
          }
        });
      }
    }
    // Check for marks-related queries
    else if (messageLower.includes("marks") || messageLower.includes("grade") || messageLower.includes("score")) {
      if (marksData.length === 0) {
        reply = "No marks data available yet.";
      } else {
        const totalMarks = marksData.reduce((sum, m) => sum + m.marksObtained, 0);
        const totalPossible = marksData.reduce((sum, m) => sum + m.totalMarks, 0);
        const averagePercentage =
          totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;

        reply = `Your average marks: ${Math.round(averagePercentage * 100) / 100}%\n\n`;
        reply += "Subject-wise marks:\n";
        marksData.forEach((item) => {
          const percentage =
            item.totalMarks > 0
              ? (item.marksObtained / item.totalMarks) * 100
              : 0;
          reply += `• ${item.subject}: ${item.marksObtained}/${item.totalMarks} (${Math.round(percentage * 100) / 100}%)\n`;
        });
      }
    }
    // Check for subjects below 75% marks
    else if (messageLower.includes("below") && messageLower.includes("75")) {
      const subjectsBelow75 = marksData
        .map((item) => {
          const percentage =
            item.totalMarks > 0
              ? (item.marksObtained / item.totalMarks) * 100
              : 0;
          return {
            subject: item.subject,
            percentage: Math.round(percentage * 100) / 100,
            marks: item.marksObtained,
            total: item.totalMarks,
          };
        })
        .filter((item) => item.percentage < 75);

      if (subjectsBelow75.length > 0) {
        reply = "Subjects below 75% marks:\n";
        subjectsBelow75.forEach((item) => {
          reply += `• ${item.subject}: ${item.percentage}% (${item.marks}/${item.total})\n`;
        });
      } else {
        reply = "Great! All your subjects have 75% or higher marks.";
      }
    }
    // Generic help message
    else {
      reply =
        "I can help you with:\n" +
        "• Attendance queries: 'How many classes do I need in [subject] to reach 75%?'\n" +
        "• Marks queries: 'What's my average marks?' or 'Which subjects are below 75%?'\n" +
        "• General: 'Which subjects are below 75% attendance?'\n\n" +
        "Try asking me about your attendance or marks!";
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;


