import { Router, Request, Response } from "express";
import Attendance from "../models/Attendance";
import User from "../models/User";
import { verifyAccessToken } from "../middleware/auth";

const router = Router();

// Helper function to check if user is teacher/admin
const isTeacherOrAdmin = async (userId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    return user?.role === "teacher" || user?.role === "admin";
  } catch {
    return false;
  }
};

// Get attendance for a specific user
router.get("/:userId", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    // Allow access if user is accessing their own data OR if user is teacher/admin
    const canAccess = userId === authenticatedUserId || await isTeacherOrAdmin(authenticatedUserId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendance = await Attendance.find({ userId });

    // Calculate percentage for each subject
    const attendanceWithPercentage = attendance.map((item) => ({
      _id: item._id,
      subject: item.subject,
      attendedClasses: item.attendedClasses,
      totalClasses: item.totalClasses,
      percentage: item.totalClasses > 0
        ? Math.round((item.attendedClasses / item.totalClasses) * 100 * 100) / 100
        : 0,
    }));

    return res.json(attendanceWithPercentage);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create or update attendance
router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { userId, subject, totalClasses, attendedClasses } = req.body;
    const authenticatedUserId = (req as any).user.userId;

    if (!userId || !subject || totalClasses === undefined || attendedClasses === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allow if user is updating their own data OR if user is teacher/admin
    const canUpdate = userId === authenticatedUserId || await isTeacherOrAdmin(authenticatedUserId);

    if (!canUpdate) {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { userId, subject },
      { userId, subject, totalClasses, attendedClasses },
      { upsert: true, new: true }
    );

    return res.json({ message: "Attendance saved successfully!", attendance });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

