import { Router, Request, Response } from "express";
import User from "../models/User";
import Attendance from "../models/Attendance";
import Marks from "../models/Marks";
import { verifyAccessToken } from "../middleware/auth";
import { requireTeacherOrAdmin } from "../middleware/checkRole";
import { calculateRisk, RiskProfile } from "../utils/riskEngine";

const router = Router();

// Interface for the response object
interface StudentRiskData extends RiskProfile {
    userId: string;
    name: string;
    email: string;
    overallAttendancePct: number;
    averageMarksPct: number;
}

/**
 * GET /api/risk/students
 * Restricted to Teachers and Admins.
 * Returns a list of all students with their calculated risk profiles.
 */
router.get("/students", verifyAccessToken, requireTeacherOrAdmin, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        // Role check handled by middleware now (consistent with users.ts)

        // 2. Fetch all students
        // We assume users with role 'student' are the target
        const students = await User.find({ role: "student" }).select("-password");

        const riskReport: StudentRiskData[] = [];

        // 3. For each student, aggregate data and calculate risk
        // Note: parallelizing this with Promise.all is better for performance than await in loop
        const studentPromises = students.map(async (student) => {
            // A. Fetch Attendance
            // Aggregate: sum(attended) / sum(total) * 100
            const attendanceRecords = await Attendance.find({ userId: String(student._id) });
            let totalClasses = 0;
            let totalAttended = 0;
            attendanceRecords.forEach(r => {
                totalClasses += r.totalClasses;
                totalAttended += r.attendedClasses;
            });
            const overallAttendancePct = totalClasses > 0
                ? Math.round((totalAttended / totalClasses) * 100)
                : 0; // Default to 0 if no data, or maybe 100? Let's say 0 for safety but it might trigger false risk. 
            // If no classes exist, maybe risk is undefined? 
            // For now, let's treat 0 classes as 100% attendance (neutral) to avoid flagging new students.
            // Revised: If totalClasses is 0, let's say 100 to be safe.
            const safeAttendancePct = totalClasses > 0 ? overallAttendancePct : 100;


            // B. Fetch Marks
            // Aggregate: sum(obtained) / sum(total) * 100
            const marksRecords = await Marks.find({ userId: String(student._id) });
            let totalMaxMarks = 0;
            let totalObtainedMarks = 0;
            marksRecords.forEach(m => {
                totalMaxMarks += m.totalMarks;
                totalObtainedMarks += m.marksObtained;
            });
            const averageMarksPct = totalMaxMarks > 0
                ? Math.round((totalObtainedMarks / totalMaxMarks) * 100)
                : 0; // Similarly, if no marks, assume neutral? Or 0?
            // Let's assume 0 for marks implies "not performed yet" or "failing".
            // Actually, if no exams taken, they aren't at risk of failing exams.
            // Let's use 100 as safe default if no data exists.
            const safeMarksPct = totalMaxMarks > 0 ? averageMarksPct : 100;

            // C. Calculate Risk
            const riskProfile = calculateRisk(safeAttendancePct, safeMarksPct);

            return {
                userId: String(student._id),
                name: student.email.split('@')[0], // Simple name extraction if name field is missing or use email
                email: student.email,
                overallAttendancePct: safeAttendancePct,
                averageMarksPct: safeMarksPct,
                ...riskProfile
            };
        });

        const results = await Promise.all(studentPromises);

        return res.json(results);

    } catch (error) {
        console.error("Risk API Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
