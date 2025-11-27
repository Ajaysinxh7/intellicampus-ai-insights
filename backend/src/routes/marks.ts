import { Router, Request, Response } from "express";
import Marks from "../models/Marks";
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

// Get marks for a specific user
router.get("/:userId", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    // Allow access if user is accessing their own data OR if user is teacher/admin
    const canAccess = userId === authenticatedUserId || await isTeacherOrAdmin(authenticatedUserId);
    
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const marks = await Marks.find({ userId });
    
    // Calculate percentage for each subject
    const marksWithPercentage = marks.map((item) => ({
      _id: item._id,
      subject: item.subject,
      marksObtained: item.marksObtained,
      totalMarks: item.totalMarks,
      percentage: item.totalMarks > 0
        ? Math.round((item.marksObtained / item.totalMarks) * 100 * 100) / 100
        : 0,
    }));

    return res.json(marksWithPercentage);
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create or update marks
router.post("/", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const { userId, subject, marksObtained, totalMarks } = req.body;
    const authenticatedUserId = (req as any).user.userId;

    if (!userId || !subject || marksObtained === undefined || totalMarks === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allow if user is updating their own data OR if user is teacher/admin
    const canUpdate = userId === authenticatedUserId || await isTeacherOrAdmin(authenticatedUserId);
    
    if (!canUpdate) {
      return res.status(403).json({ message: "Access denied" });
    }

    const marks = await Marks.findOneAndUpdate(
      { userId, subject },
      { userId, subject, marksObtained, totalMarks },
      { upsert: true, new: true }
    );

    return res.json({ message: "Marks saved successfully!", marks });
  } catch (error) {
    console.error("Error saving marks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

