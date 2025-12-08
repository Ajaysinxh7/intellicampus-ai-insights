import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Attendance from "../models/Attendance";
import Marks from "../models/Marks";
import { HistoricalPerformance } from "../models/HistoricalPerformance"; // Import HistoricalPerformance
import { verifyAccessToken } from "../middleware/auth";
import { classesNeeded } from "../utils/calcAttendance";
import { calculateRegression } from "../utils/analytics"; // Import regression utility

const router = Router();

router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    // Initialize Gemini API lazily to ensure env vars are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    const { userId, message } = req.body;
    const authenticatedUserId = (req as any).user.userId;

    // Ensure user can only access their own data
    // Ensure user can only access their own data IF they are a student
    // Teachers/Admins can access this route freely
    // userRole is declared below, let's move it up or just use (req as any).user.role directly for this early check
    if ((req as any).user.role === 'student' && userId !== authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in environment variables.");
      return res.status(500).json({
        reply: "I'm currently unable to process complex queries. Please contact the administrator to configure my AI brain (API Key missing)."
      });
    }

    // Fetch all attendance and marks for the user
    const attendanceData = await Attendance.find({ userId });
    const marksData = await Marks.find({ userId });

    // Fetch Historical Data for Prediction
    // We fetch all records to build models for available subjects
    const historicalData = await HistoricalPerformance.find({});

    // Group historical data by subject
    const subjectHistory: { [key: string]: any[] } = {};
    historicalData.forEach(record => {
      if (!subjectHistory[record.subject]) {
        subjectHistory[record.subject] = [];
      }
      subjectHistory[record.subject].push(record);
    });

    // Calculate regression models for each subject
    const predictionModels: { [key: string]: { slope: number, intercept: number } } = {};
    for (const subject in subjectHistory) {
      predictionModels[subject] = calculateRegression(subjectHistory[subject]);
    }

    // Prepare context data for the AI
    let studentContext: any = {};
    let systemInstruction = "";

    const userRole = (req as any).user.role;

    // ---------------------------------------------------------
    // 👩‍🏫 TEACHER MODE
    // ---------------------------------------------------------
    if (userRole === 'teacher' || userRole === 'admin') {
      // 1. Fetch all students
      const students = await (await import("../models/User")).default.find({ role: "student" });
      const totalStudents = students.length;

      // 2. Fetch all academic data
      const allAttendance = await Attendance.find({});
      const allMarks = await Marks.find({});

      // 3. Calculate Class Averages
      let totalAttendancePct = 0;
      let totalAttendanceCount = 0;
      allAttendance.forEach(a => {
        if (a.totalClasses > 0) {
          totalAttendancePct += (a.attendedClasses / a.totalClasses) * 100;
          totalAttendanceCount++;
        }
      });
      const avgClassAttendance = totalAttendanceCount > 0 ? Math.round(totalAttendancePct / totalAttendanceCount) : 0;

      let totalMarksPct = 0;
      let totalMarksCount = 0;
      allMarks.forEach(m => {
        if (m.totalMarks > 0) {
          totalMarksPct += (m.marksObtained / m.totalMarks) * 100;
          totalMarksCount++;
        }
      });
      const avgClassMarks = totalMarksCount > 0 ? Math.round(totalMarksPct / totalMarksCount) : 0;

      // 4. Identify At-Risk Students (Simple Count)
      // We'll use a simplified check here to avoid heavy processing, or just pass averages
      // For more detail, we could list specific failing students, but let's start with summary.

      // 4. Check if a specific student is selected for analysis
      const { targetStudentId } = req.body;

      if (targetStudentId) {
        // Teacher is asking about a specific student
        // Fetch that student's data
        const studentAttendance = await Attendance.find({ userId: targetStudentId });
        const studentMarks = await Marks.find({ userId: targetStudentId });

        // Build Student Context (Reusing logic from student mode)
        const specificStudentContext = {
          role: "teacher_analyzing_student",
          attendance: studentAttendance.map(a => ({
            subject: a.subject,
            attended: a.attendedClasses,
            total: a.totalClasses,
            percentage: a.totalClasses > 0 ? Math.round((a.attendedClasses / a.totalClasses) * 100) : 0,
            classesNeededFor75: classesNeeded(a.attendedClasses, a.totalClasses, 75)
          })),
          marks: studentMarks.map(m => ({
            subject: m.subject,
            obtained: m.marksObtained,
            total: m.totalMarks,
            percentage: m.totalMarks > 0 ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0
          })),
          predictionModels: predictionModels
        };

        studentContext = specificStudentContext;

        systemInstruction = `
          You are an expert Teaching Assistant.
          You are analyzing a specific student ID: ${targetStudentId} for a teacher.
          
          Here is the student's data (same structure as student view):
          ${JSON.stringify(studentContext, null, 2)}
          
          Teacher's Query: "${message}"
          
          Instructions:
          1. Answer the teacher's questions about THIS student's performance.
          2. Use the same detailed analysis as you would for a student (predict grades, suggest improvements).
          3. Be objective and professional.
          4. **Predictive Performance**:
             - Use the provided 'predictionModels' to estimate future grades if asked.
             - Do NOT show formulas.
        `;
      } else {
        // General Class Overview (No student selected)
        studentContext = {
          role: "teacher_class_overview",
          classSummary: {
            totalStudents,
            avgClassAttendance: `${avgClassAttendance}%`,
            avgClassMarks: `${avgClassMarks}%`,
            totalAttendanceRecords: allAttendance.length,
            totalMarksRecords: allMarks.length
          }
        };

        systemInstruction = `
          You are an expert Teaching Assistant and Data Analyst.
          You are speaking to a TEACHER about the WHOLE CLASS.
          
          Here is the overview of the entire class:
          ${JSON.stringify(studentContext, null, 2)}
          
          Teacher's Query: "${message}"
          
          Instructions:
          1. Answer questions about class performance.
          2. If they ask for specific student details, ask them to "Select a student" in the dashboard first.
          3. Provide insights on class averages.
        `;
      }

    }
    // ---------------------------------------------------------
    // 👨‍🎓 STUDENT MODE
    // ---------------------------------------------------------
    else {
      const userDetails = await (await import("../models/User")).default.findById(userId);

      studentContext = {
        role: "student",
        profile: {
          name: userDetails?.name || "N/A",
          email: userDetails?.email || "N/A",
          enrollmentNumber: userDetails?.enrollmentNumber || "N/A",
          branch: userDetails?.branch || "N/A",
          collegeName: userDetails?.collegeName || "N/A",
        },
        attendance: attendanceData.map(a => ({
          subject: a.subject,
          attended: a.attendedClasses,
          total: a.totalClasses,
          percentage: a.totalClasses > 0 ? Math.round((a.attendedClasses / a.totalClasses) * 100) : 0,
          classesNeededFor75: classesNeeded(a.attendedClasses, a.totalClasses, 75)
        })),
        marks: marksData.map(m => ({
          subject: m.subject,
          obtained: m.marksObtained,
          total: m.totalMarks,
          percentage: m.totalMarks > 0 ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0
        })),
        // Feed the regression models to the AI
        predictionModels: predictionModels
      };

      systemInstruction = `
        You are an intelligent and helpful academic assistant for a student.
        
        Here is the student's current academic data, Profile, and Predictive Models:
        ${JSON.stringify(studentContext, null, 2)}
  
        Student's Query: "${message}"
  
        Instructions:
        1. Analyze the student's data to answer their query accurately.
        2. **Profile Details**: If the student asks for their details, profile, or "who am I", display their Name, Enrollment Number, Branch, and College Name clearly from the 'profile' section.
        3. If they ask about attendance, mention their current percentage and how many classes they need to attend (if applicable) to reach 75%.
        4. If they ask about marks, provide their scores and averages.
        5. **Predictive Performance**:
           - You possess linear regression models in 'predictionModels' for various subjects (slope & intercept).
           - If the student asks to "predict my grade", "what will I score", or "how to improve" for a specific subject:
              a. Find the matching Subject in the student's Attendance data.
              b. Use the formula: Estimated Final Grade = (slope * current_attendance_percentage) + intercept.
              c. Calculate it. Clamp the result between 0 and 100.
              d. Present the *Predicted Grade* clearly.
              e. Also calculate the "Insight": What if they increase attendance by 10%? (Use same formula with current_attendance + 10). Tell them the potential gain.
           - If the subject is not found in 'predictionModels', politely say you don't have enough historical data for that subject yet.
        6. Be encouraging and constructive.
        7. **IMPORTANT OUTPUT RULE**: Do NOT show the internal formula (slope/intercept) or the mathematical calculation steps in your response. Just state the final result naturally. 
           - BAD: "Your grade is calculated as (0.8 * 50) + 10 = 50."
           - GOOD: "Based on your current attendance, your predicted grade is approximately 50%."
        8. Keep the response concise, natural, and conversational. Do not use markdown tables, use bullet points if listing items.
        9. If the query is unrelated to their data (e.g., "Hello", "Who are you"), respond politely as an AI assistant.
      `;
    }

    // Generate response using Gemini
    // Using gemini-2.0-flash as it is available for this key
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const text = response.text();

    return res.json({ reply: text });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      reply: "I'm having trouble thinking right now. Please try again later."
    });
  }
});

export default router;
